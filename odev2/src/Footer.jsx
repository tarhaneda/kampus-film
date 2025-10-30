
import React from 'react';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>&copy; {year} - EDA NUR TARHAN - Kampüs Film Kulübü</p>
    </footer>
  );
}

export default Footer;