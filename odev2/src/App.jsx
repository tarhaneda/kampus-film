// src/App.jsx
import React, { useReducer, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { reducer, initialState, ACTIONS } from './reducer';
import SearchBox from './SearchBox';
import TVList from './TVList';
import WatchListPanel from './WatchListPanel'; // Bu dosyanın var olduğundan emin olun
import Pagination from './Pagination';
import Footer from './Footer';
import ShowDetail from './ShowDetail';
import Filters from './Filters';
import './App.css'; 

// API adresi
const API_URL = 'https://api.tvmaze.com/search/shows?q=';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedShowId, setSelectedShowId] = useState(null);

  // useEffect: Asenkron veri çekme
  useEffect(() => {
    if (!state.query) {
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: [] });
      return;
    }
    const fetchShows = async () => {
      dispatch({ type: ACTIONS.FETCH_INIT });
      try {
        const response = await axios.get(`${API_URL}${state.query}`);
        const showsData = response.data.map((item) => item.show);
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: showsData });
      } catch (error) {
        dispatch({ type: ACTIONS.FETCH_FAILURE, payload: 'Veri çekilemedi.' });
      }
    };
    const timerId = setTimeout(() => {
      fetchShows();
    }, 500);
    return () => clearTimeout(timerId);
  }, [state.query]);

  // useEffect: İzleme listesini localStorage'a kaydetme
  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    } catch (e) {
      console.warn("İzleme listesi localStorage'a kaydedilemedi", e);
    }
  }, [state.watchlist]);


  // --- Callback Handler'lar ---

  const handleSearch = (newQuery) => {
    dispatch({ type: ACTIONS.SET_QUERY, payload: newQuery });
  };

  const handleFilterChange = (filterUpdate) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filterUpdate });
  };

  // YENİ HANDLER: Filtreleri sıfırla
  const handleResetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  };

  const handleAddToWatchlist = (show) => {
    dispatch({ type: ACTIONS.ADD_WATCHLIST, payload: show });
  };

  const handleRemoveFromWatchlist = (show) => {
    dispatch({ type: ACTIONS.REMOVE_WATCHLIST, payload: show });
  };

  // YENİ HANDLER: İzleme listesini temizle
  const handleClearWatchlist = () => {
    // Kullanıcıya onaylatmak iyi bir pratiktir
    if (window.confirm("İzleme listenizi tamamen temizlemek istediğinizden emin misiniz?")) {
      dispatch({ type: ACTIONS.CLEAR_WATCHLIST });
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(filteredShows.length / state.pageSize);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch({ type: ACTIONS.SET_PAGE, payload: newPage });
    }
  };

  const handleShowDetails = (id) => {
    setSelectedShowId(id);
  };

  const handleBackToList = () => {
    setSelectedShowId(null);
  };

  // --- Veri Hesaplamaları ---

  const availableGenres = useMemo(() => {
    const allGenres = new Set();
    state.shows.forEach((show) => {
      show.genres?.forEach((genre) => allGenres.add(genre));
    });
    return ['all', ...Array.from(allGenres).sort()];
  }, [state.shows]);

  const availableLanguages = useMemo(() => {
    const allLanguages = new Set();
    state.shows.forEach((show) => {
      if (show.language) allLanguages.add(show.language);
    });
    return ['all', ...Array.from(allLanguages).sort()];
  }, [state.shows]);

  // Filtreleme Mantığı
  const filteredShows = useMemo(() => {
    const { genre, language, rating } = state.filters;
    return state.shows.filter((show) => {
      const genreMatch =
        genre === 'all' || (show.genres && show.genres.includes(genre));
      const languageMatch =
        language === 'all' || show.language === language;
      const showRating = show.rating?.average || 0;
      const ratingMatch = showRating >= rating;
      return genreMatch && languageMatch && ratingMatch;
    });
  }, [state.shows, state.filters]);

  // Sayfalama için toplam sayfa sayısı
  const totalPages = Math.ceil(filteredShows.length / state.pageSize);

  // Gösterilecek dizileri sayfalama
  const paginatedShows = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return filteredShows.slice(startIndex, endIndex);
  }, [filteredShows, state.currentPage, state.pageSize]);

  // --- Koşullu Render (Conditional Rendering) ---
  const renderContent = () => {
    if (selectedShowId) {
      return <ShowDetail showId={selectedShowId} onBack={handleBackToList} />;
    }
    if (state.loading) {
      return <div className="feedback-message">Yükleniyor...</div>;
    }
    if (state.error) {
      return (
        <div className="feedback-message error">
          Hata: {state.error}
          <button onClick={() => handleSearch(state.query)}>Tekrar Dene</button>
        </div>
      );
    }
    if (filteredShows.length === 0 && state.query) {
      return <div className="feedback-message">Filtreye uygun sonuç bulunamadı.</div>;
    }
    if (filteredShows.length === 0 && !state.query) {
       return <div className="feedback-message">Lütfen bir dizi arayın.</div>;
    }
    return (
      <>
        <TVList
          shows={paginatedShows}
          onAddToWatchlist={handleAddToWatchlist}
          onShowDetails={handleShowDetails}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={state.currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  // --- Ana JSX Çıktısı ---
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kampüs Film Kulübü</h1>
        {!selectedShowId && (
          <>
            <SearchBox query={state.query} onSearch={handleSearch} />
            <Filters
              filters={state.filters}
              availableGenres={availableGenres}
              availableLanguages={availableLanguages}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters} // YENİ PROP
            />
          </>
        )}
      </header>

      <main className="app-main">
        <div className="main-content">{renderContent()}</div>
        <aside className="sidebar">
          <WatchListPanel
            watchlist={state.watchlist}
            onRemove={handleRemoveFromWatchlist}
            onClearWatchlist={handleClearWatchlist} // YENİ PROP
          />
        </aside>
      </main>

      <Footer />
    </div>
  );
}

export default App;