import { NavLink } from 'react-router-dom';
import './BottomNav.css';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/village" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">🏘️</span>
        <span className="nav-label">Village</span>
      </NavLink>
      <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">🗺️</span>
        <span className="nav-label">Map</span>
      </NavLink>
      <NavLink to="/barracks" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">⚔️</span>
        <span className="nav-label">Barracks</span>
      </NavLink>
      <NavLink to="/build" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">🏗️</span>
        <span className="nav-label">Build</span>
      </NavLink>
      <NavLink to="/rally" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">🎯</span>
        <span className="nav-label">Rally</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
