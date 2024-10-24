import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Providers } from './components';

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  )
}
