import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ClientStoreProvider} from 'client-web-storage/helpers/use-client-store';
import {AppStateProvider} from 'client-web-storage/helpers/use-app-state';
import {stores} from "./stores";
import {states} from "./states";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* provide your app with all the stores it needs */}
    <AppStateProvider states={states}>
      <ClientStoreProvider stores={stores}>
        <App />
      </ClientStoreProvider>
    </AppStateProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
