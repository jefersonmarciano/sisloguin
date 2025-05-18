
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ArrowLeft } from 'lucide-react' // Import the icon specifically

// Add the icon to the window object to make it available globally
window.ArrowLeft = ArrowLeft;

createRoot(document.getElementById("root")!).render(<App />);
