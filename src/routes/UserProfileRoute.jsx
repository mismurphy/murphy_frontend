import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - chart pages

// render - map pages
const ChangePasswordPage = Loadable(lazy(() => import('views/ChangePassword')));
const UserProfilePage = Loadable(lazy(() => import('views/UserProfile')));

// ==============================|| CHART & MAP ROUTING ||============================== //

const UserProfileRoute = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          children: [
            {
              path: 'change-password',
              element: <ChangePasswordPage />
            }
          ]
        },
        {
          path: '/',
          children: [
            {
              path: 'profile',
              element: <UserProfilePage />
            }
          ]
        }
      ]
    }
  ]
};

export default UserProfileRoute;
