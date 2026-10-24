import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🛡️ Silencer global des exceptions et rejets liés aux WebSockets de développement
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (!reason) return;
  const reasonStr = String(reason.message || reason);
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('websocket') ||
    reasonStr.includes('failed to connect') ||
    reasonStr.includes('closed without opened')
  ) {
    console.warn('⚠️ [Supprimé] Erreur HMR :', reasonStr);
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
});

window.addEventListener('error', (event) => {
  const msg = String(event.message || event.error?.message || '');
  if (
    msg.includes('WebSocket') ||
    msg.includes('websocket') ||
    msg.includes('failed to connect') ||
    msg.includes('closed without opened')
  ) {
    console.warn('⚠️ [Supprimé] Alerte HMR :', msg);
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}, true);

// interceptor global fetch pour insérer l'Authorization Bearer token
const originalFetch = window.fetch;
try {
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    writable: true,
    value: async function (input: RequestInfo | URL, init?: RequestInit) {
      const token = (window as any).aura_auth_token;
      let url = '';
      if (typeof input === 'string') {
        url = input;
      } else if (input && typeof input === 'object' && 'url' in input) {
        url = (input as any).url;
      } else if (input instanceof URL) {
        url = input.toString();
      }
      
      if (token && (url.startsWith('/api/') || url.includes('/api/'))) {
        init = init || {};
        const headers = { ...(init.headers as any) };
        headers['Authorization'] = `Bearer ${token}`;
        init.headers = headers;
      }
      return originalFetch(input, init);
    }
  });
} catch (err) {
  console.error("Impossible de définir window.fetch avec Object.defineProperty:", err);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
