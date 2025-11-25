import './disableConsole';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './responsive.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
);
