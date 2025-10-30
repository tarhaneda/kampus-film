import React from 'react';

function Filters({
  filters,
  availableGenres,
  availableLanguages,
  onFilterChange,
  onResetFilters, // YENİ PROP
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Puanı sayıya dönüştür, diğerlerini string bırak
    const newValue = name === 'rating' ? parseFloat(value) || 0 : value;
    onFilterChange({ [name]: newValue });
  };

  return (
    <div className="filters-container">
      {/* Tür Filtresi */}
      <div className="filter-group">
        <label htmlFor="genre-filter">Tür:</label>
        <select
          id="genre-filter"
          name="genre"
          value={filters.genre}
          onChange={handleInputChange}
        >
          {availableGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === 'all' ? 'Tümü' : genre}
            </option>
          ))}
        </select>
      </div>

      {/* Dil Filtresi */}
      <div className="filter-group">
        <label htmlFor="language-filter">Dil:</label>
        <select
          id="language-filter"
          name="language"
          value={filters.language}
          onChange={handleInputChange}
        >
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang === 'all' ? 'Tümü' : lang}
            </option>
          ))}
        </select>
      </div>

      {/* Puan Filtresi */}
      <div className="filter-group">
        <label htmlFor="rating-filter">Min. Puan:</label>
        <input
          type="number"
          id="rating-filter"
          name="rating"
          min="0"
          max="10"
          step="0.1"
          value={filters.rating}
          onChange={handleInputChange}
          placeholder="0.0"
        />
      </div>

      {/* YENİ BUTON GRUBU */}
      <div className="filter-group filter-reset-group">
        <button onClick={onResetFilters} className="btn-reset">
          Filtreleri Sıfırla
        </button>
      </div>
    </div>
  );
}

export default Filters;