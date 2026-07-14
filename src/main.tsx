import React from 'react';
import ReactDOM from 'react-dom/client';
// One family for the whole site. The identity comes from weight and scale
// contrast (Archivo carries wght 100–900), not from mixing typefaces — and it
// drops the font payload from 241 KB across three families to a single file.
import '@fontsource-variable/archivo';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
