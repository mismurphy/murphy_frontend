import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - basic component pages
const Fms = Loadable(lazy(() => import('views/FMS/Fms')));

// ==============================|| COMPONENT ROUTING ||============================== //

const FmsRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'FMS',
          children: [
            {
              path: 'Fms Master',
              element: <Fms />
            },
          ]
        }
      ]
    }
  ]
};

export default FmsRoutes;
