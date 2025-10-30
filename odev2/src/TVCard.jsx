
import React from 'react';

function TVCard({ show, onAddToWatchlist, onShowDetails }) {
  const { name, image, summary, rating, genres, language } = show;


  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  const shortSummary = summary ? stripHtml(summary).substring(0, 100) + '...' : 'Özet mevcut değil.'; // 

  return (
    <div className="tv-card">
      <div className="tv-card-image">
        <img src={image?.medium || 'https://via.placeholder.com/210x295.png?text=No+Image'} alt={name} />
      </div>
      <div className="tv-card-content">
        <h3>{name}</h3> {/*  */}
        <p><strong>Puan:</strong> {rating?.average || 'N/A'} | <strong>Dil:</strong> {language || 'N/A'}</p> {}
        <p><strong>Türler:</strong> {genres?.join(', ') || 'N/A'}</p> {/*  */}
        <p className="tv-card-summary">{shortSummary}</p>
        <div className="tv-card-actions">
          <button className="btn-detail" onClick={() => onShowDetails(show.id)}>Detay</button> {}
          <button onClick={() => onAddToWatchlist(show)}>Kısa Listeye Ekle</button> {}
        </div>
      </div>
    </div>
  );
}

export default TVCard;