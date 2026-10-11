import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Dashboard from './Dashboard.jsx';
import ContactPage from './ContactPage.jsx';
import TransitionSlide from './TransitionSlide.jsx';
import './style.css';

function Router() {
  const [route, setRoute] = useState(window.location.hash);
  const [transition, setTransition] = useState({
    active: false,
    fading: false,
    target: null,
  });
  const currentRouteRef = useRef(window.location.hash);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    currentRouteRef.current = route;
  }, [route]);

  useEffect(() => {
    const handleRoute = () => {
      const newHash = window.location.hash;
      const wasDemo = currentRouteRef.current.startsWith('#/demo');
      const isDemo = newHash.startsWith('#/demo');

      if (wasDemo !== isDemo) {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;

        setTransition({
          active: true,
          fading: false,
          target: isDemo ? 'demo' : 'ad',
        });

        setTimeout(() => {
          setRoute(newHash);
          window.scrollTo(0, 0);
          setTransition(prev => ({ ...prev, fading: true }));

          setTimeout(() => {
            setTransition({ active: false, fading: false, target: null });
            isTransitioningRef.current = false;
          }, 450);
        }, 850);
      } else {
        setRoute(newHash);
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  return (
    <>
      {route.startsWith('#/demo')
        ? <Dashboard />
        : route.startsWith('#/contact')
          ? <ContactPage />
          : <App />}
      {transition.active && (
        <TransitionSlide
          fading={transition.fading}
          target={transition.target}
        />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<Router />);
