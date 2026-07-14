import React from 'react';
import ReactDOM from 'react-dom/client';
// One family for the whole site. The identity comes from weight and scale
// contrast (Archivo carries wght 100–900), not from mixing typefaces — and it
// drops the font payload from 241 KB across three families to a single file.
import '@fontsource-variable/archivo';
// Second family, deliberately: the brand layer — logo, chrome labels, row titles.
// Saira stands in for Eurostile, which is a licensed Linotype face and cannot be
// self-hosted. It was chosen over Michroma because Michroma is the *extended*
// cut and read as stretched at title size; Saira is square at normal width, and
// being variable it also carries weights, which Michroma did not.
import '@fontsource-variable/saira';
// Body copy: sublines, descriptions, the About paragraphs. Only the weights the
// page actually sets — a Poppins family import would pull nine of them.
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
