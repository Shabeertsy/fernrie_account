import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupInterceptors } from './api/axios'
import { useAuthStore } from './store/useAuthStore'

// Setup axios interceptors with the store
setupInterceptors(useAuthStore);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
