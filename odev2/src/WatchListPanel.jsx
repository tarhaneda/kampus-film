import React from 'react';

// App.jsx'ten gelen proplar: watchlist, onRemove
// YENİ PROP: onClearWatchlist
function WatchListPanel({ watchlist, onRemove, onClearWatchlist }) {
  return (
    <div className="watchlist-panel">
      
      {/* Başlığı ve temizle butonunu içeren yeni bir header div'i */}
      <div className="watchlist-header">
        <h3>Gösterime Girecekler ({watchlist.length})</h3>
        
        {/* YENİ BUTON: Sadece listede en az 1 öğe varsa göster */}
        {watchlist.length > 0 && (
          <button onClick={onClearWatchlist} className="btn-clear-list">
            Tümünü Temizle
          </button>
        )}
      </div>
      
      {/* Listenin içeriği */}
      {watchlist.length === 0 ? (
        <p className="watchlist-empty">Listeniz boş.</p>
      ) : (
        <ul>
          {watchlist.map(show => (
            <li key={show.id}>
              <span>{show.name}</span>
              <button onClick={() => onRemove(show)} title="Kaldır">
                X
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WatchListPanel;