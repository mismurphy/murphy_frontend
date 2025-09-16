import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// project-imports
import Breadcrumbs from 'components/Breadcrumbs';
import Drawer from './Drawer';
import Footer from './Footer';
import Header from './Header';
import NavigationScroll from 'components/NavigationScroll';
import Protected from '../../components/Protected';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {

  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await Protected();
      setIsAuthenticated(valid);
    };
    checkAuth();
  }, []);

  // while checking token
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Drawer />
      <Header />
      <div className="pc-container">
        <div className="pc-content">
          <Breadcrumbs />
          <NavigationScroll>
            <Outlet />
          </NavigationScroll>
        </div>
      </div>
      <Footer />
    </div>
  );
}
