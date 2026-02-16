import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoot } from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import './App.css';

import Village from './pages/Village';
import Map from './pages/Map';
import Barracks from './pages/Barracks';
import Build from './pages/Build';
import RallyPoint from './pages/RallyPoint';
import BottomNav from './components/BottomNav';
import GameLoop from './components/GameLoop';

function App() {
  useEffect(() => {
    // Apply Telegram theme colors
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Set theme colors
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor || '#000000');
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.hintColor || '#999999');
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.linkColor || '#2481cc');
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.buttonColor || '#2481cc');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.buttonTextColor || '#ffffff');
    }
  }, []);

  return (
    <AppRoot>
      <Router basename="/tribal-wars-tma">
        <div className="app-container">
          <GameLoop />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/village" replace />} />
              <Route path="/village" element={<Village />} />
              <Route path="/map" element={<Map />} />
              <Route path="/barracks" element={<Barracks />} />
              <Route path="/build" element={<Build />} />
              <Route path="/rally" element={<RallyPoint />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </Router>
    </AppRoot>
  );
}

export default App;
