import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Providers } from './components';
import './configure';
import './index.css';

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
