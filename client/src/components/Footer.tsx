import React from 'react';

const Footer: React.FC = () => (
  <footer style={{
    background: '#f1f1f1',
    color: '#333',
    padding: '1rem',
    marginTop: '2rem',
    textAlign: 'center'
  }}>
    <span>© {new Date().getFullYear()} DevConnect</span>
  </footer>
);

export default Footer;