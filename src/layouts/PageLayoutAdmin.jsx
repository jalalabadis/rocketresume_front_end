import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function PageLayoutAdmin({ userData, setCurrentScreen, currentScreen, children, background }) {
  const location = useLocation(); // Hook to get the current route

  return (
    <div className="dashboard-container">
      {/* <!-- Navbar --> */}
      <header className="dashboard-nav">
        <div className="dashboard-nav-logo">Rocket Resume</div>
        <div className="dashboard-nav-user">Admin</div>
      </header>

      {/* <!-- Sidebar and Content --> */}
      <div className="dashboard-main">
        {/* <!-- Sidebar --> */}
        <aside className="dashboard-sidebar">
          <ul className="dashboard-menu">
            <li className={`dashboard-menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
           
            <li className={`dashboard-menu-item ${location.pathname === '/admin/all-user' ? 'active' : ''}`}>
              <Link to="/admin/all-user">All Users</Link>
            </li>
            <li className={`dashboard-menu-item ${location.pathname === '/admin/all-resumes' ? 'active' : ''}`}>
              <Link to="/admin/all-resumes">All Resume</Link>
            </li>
            <li  className={`dashboard-menu-item ${location.pathname === '/support' ? 'active' : ''}`}>
            <Link to="/support">Support Message</Link></li>
          </ul>
        </aside>
        {/* <!-- Main Content --> */}
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

export default PageLayoutAdmin;
