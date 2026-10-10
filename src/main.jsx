import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Dashboard from './Dashboard.jsx';
import './style.css';

function Router() {
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => {
    const handleRoute = () => { setRoute(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);
  return route.startsWith('#/demo') ? <Dashboard /> : <App />;
}

createRoot(document.getElementById('root')).render(<Router />);
