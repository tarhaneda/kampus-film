
import React from 'react';
import TVCard from './TVCard';

function TVList({ shows, onAddToWatchlist, onShowDetails }) {
  return (
    <div className="tv-list">
      {shows.map((show) => (
        <TVCard
          key={show.id}
          show={show}
          onAddToWatchlist={onAddToWatchlist}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
}

export default TVList;