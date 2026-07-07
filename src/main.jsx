import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ShopProvider } from './context/ShopContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ShopProvider>
  </StrictMode>,
)
