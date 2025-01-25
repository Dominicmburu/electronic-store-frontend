import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

const root = ReactDOM.createRoot(document.getElementById('root')!); 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
