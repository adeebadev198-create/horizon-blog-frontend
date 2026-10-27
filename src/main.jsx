import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';

// Polyfill findDOMNode for React 19 compatibility
if (typeof ReactDOM.findDOMNode !== 'function') {
  ReactDOM.findDOMNode = (component) => {
    if (!component) return null;
    if (component instanceof HTMLElement) return component;
    return component._reactInternals?.stateNode || null;
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
