import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Initialize Eruda console in development mode
if (import.meta.env.DEV) {
  import('eruda').then(({ default: eruda }) => {
    eruda.init();
    console.log('Eruda debugging console initialized');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
