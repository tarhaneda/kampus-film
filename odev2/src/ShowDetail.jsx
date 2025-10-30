
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShowDetail({ showId, onBack }) {
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
       
        const [showResponse, episodesResponse] = await Promise.all([
          axios.get(`https://api.tvmaze.com/shows/${showId}`), 
          axios.get(`https://api.tvmaze.com/shows/${showId}/episodes`) 
        ]);
        setShow(showResponse.data);
        setEpisodes(episodesResponse.data);
      } catch (err) {
        setError('Detaylar yüklenemedi.');
      }
      setLoading(false);
    };

    fetchDetails();
  }, [showId]); // showId değiştiğinde tekrar çalışır

  if (loading) return <div className="feedback-message">Detaylar yükleniyor...</div>;
  if (error) return <div className="feedback-message error">{error}</div>;
  if (!show) return null;
  
  // HTML temizleme
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="show-detail">
      <button onClick={onBack} className="btn-back"> &larr; Geri Dön</button>
      <h2>{show.name}</h2>
      <div className="detail-content">
        <img src={show.image?.medium} alt={show.name} />
        <div className="detail-info">
          <p>{stripHtml(show.summary)}</p>
          <p><strong>Türler:</strong> {show.genres.join(', ')}</p>
          <p><strong>Dil:</strong> {show.language}</p>
          <p><strong>Puan:</strong> {show.rating.average}</p>
        </div>
      </div>

      <h3>Bölümler ({episodes.length})</h3>
      <ul className="episodes-list">
        {episodes.map(ep => (
          <li key={ep.id}>
            <strong>S{String(ep.season).padStart(2, '0')}E{String(ep.number).padStart(2, '0')}:</strong> {ep.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowDetail;