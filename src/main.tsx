import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StingComponent } from './components/sting-component/sting-component'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StingComponent />
  </StrictMode>,
)
