import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './assets/favicon.ico';
import 'typeface-roboto';
import App from './App';

render(
  <BrowserRouter basename='/prod'>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
