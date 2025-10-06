import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import "@fontsource-variable/inter";
import './styles/globals.css';
import { AuthProvider } from './providers/auth-provider.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/shared/error-boundary.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
