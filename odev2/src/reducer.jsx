// src/reducer.js

// Eylem tipleri
export const ACTIONS = {
  FETCH_INIT: 'FETCH_INIT',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  SET_QUERY: 'SET_QUERY',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS', // YENİ EKLENDİ
  ADD_WATCHLIST: 'ADD_WATCHLIST',
  REMOVE_WATCHLIST: 'REMOVE_WATCHLIST',
  CLEAR_WATCHLIST: 'CLEAR_WATCHLIST', // Zaten vardı, şimdi kullanılacak
  SET_PAGE: 'SET_PAGE',
};

// Listeyi localStorage'dan güvenle yükleyen yardımcı fonksiyon
const loadWatchlistFromStorage = () => {
  try {
    const serializedWatchlist = localStorage.getItem('watchlist');
    if (serializedWatchlist === null) {
      return [];
    }
    return JSON.parse(serializedWatchlist);
  } catch (e) {
    console.warn("İzleme listesi localStorage'dan yüklenemedi", e);
    return [];
  }
};

export const initialState = {
  loading: false,
  error: null,
  shows: [],
  query: 'lost',
  watchlist: loadWatchlistFromStorage(),
  pageSize: 6,
  currentPage: 1,
  filters: {
    genre: 'all',
    language: 'all',
    rating: 0,
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        shows: action.payload,
        currentPage: 1,
        filters: initialState.filters,
      };
    case ACTIONS.FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ACTIONS.SET_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    case ACTIONS.SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
      
    // Filtreleri güncelle
    case ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
        currentPage: 1,
      };
      
    // YENİ CASE: Filtreleri sıfırla
    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters, // Başlangıçtaki boş filtrelere dön
        currentPage: 1, // Sayfayı da başa al
      };
      
    case ACTIONS.ADD_WATCHLIST:
      if (!state.watchlist.find((show) => show.id === action.payload.id)) {
        return {
          ...state,
          watchlist: [...state.watchlist, action.payload],
        };
      }
      return state;
      
    case ACTIONS.REMOVE_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (show) => show.id !== action.payload.id
        ),
      };
      
    // YENİ CASE: İzleme listesini temizle
    case ACTIONS.CLEAR_WATCHLIST:
      return {
        ...state,
        watchlist: [], // Listeyi boşalt
      };
      
    default:
      return state;
  }
};