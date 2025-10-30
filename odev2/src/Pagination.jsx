
import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        İlk
      </button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Geri
      </button>
      <span>
        Sayfa {currentPage} / {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        İleri
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        Son
      </button>
    </div>
  );
}

export default Pagination;