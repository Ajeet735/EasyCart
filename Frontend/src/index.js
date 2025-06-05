import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './main'; // Import the wrapper

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
