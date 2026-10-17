import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Bootstrap's styles come first...
import 'bootstrap/dist/css/bootstrap.min.css'
// ...then our own styles, so ours can override Bootstrap's where needed.
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
