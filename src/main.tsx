import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StingComponent } from './sting.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StingComponent />
  </StrictMode>,
)
