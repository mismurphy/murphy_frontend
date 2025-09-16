import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - bootstrap table pages
const BootstrapTableBasic = Loadable(lazy(() => import('views/table/bootstrap-table/BasicTable')));
const BootstrapDataTableBasic = Loadable(lazy(() => import('views/table/bootstrap-table/DataTable')));

// ==============================|| TABLES ROUTING ||============================== //

const TablesRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'tables/bootstrap-table',
          children: [
            {
              path: 'basic-table',
              element: <BootstrapTableBasic />
            },
            {
              path: 'data-table',
              element: <BootstrapDataTableBasic />
            }
          ]
        }
      ]
    }
  ]
};

export default TablesRoutes;
