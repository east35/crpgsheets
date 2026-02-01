import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './patterns/tokens.css'
import App from './App.tsx'
import { TooltipSheetProvider } from './components/TooltipSheet'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipSheetProvider>
      <App />
    </TooltipSheetProvider>
  </StrictMode>,
)
