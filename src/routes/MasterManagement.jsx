import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - chart pages
// const ApexChart = Loadable(lazy(() => import('views/charts/ApexChart')));
const FgNameCreate = Loadable(lazy(() => import('views/fg_master/fgmaster')));

// render - map pages
const GoogleMaps = Loadable(lazy(() => import('views/maps/GoogleMap')));

// ==============================|| CHART & MAP ROUTING ||============================== //

const MasterManagementRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'fg-master',
          children: [
            {
              path: 'create',
              element: <FgNameCreate />
            }
          ]
        },
        {
          path: 'Customer',
          children: [
            {
              path: 'customer-master',
              element: <GoogleMaps />
            }
          ]
        }
      ]
    }
  ]
};

export default MasterManagementRoutes;
