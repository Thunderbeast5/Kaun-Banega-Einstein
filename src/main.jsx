import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './lib/firebase.js'

console.log(
  "%cDeveloped by Vedant Purkar | vedant.purkar05@gmail.com",
  "font-weight: bold;"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
