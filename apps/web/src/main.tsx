import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './HomePage.css'
import App from './HomePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App onStartGame={function (): void {
      throw new Error('Function not implemented.')
    } } />
  </StrictMode>,
)
