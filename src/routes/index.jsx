import { createBrowserRouter } from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import MasterManagementRoutes from './MasterManagement';
import FormsRoutes from './FormsRoutes';
import TablesRoutes from './TablesRoutes';
import ChartMapRoutes from './ChartMapRoutes';
import OtherRoutes from './OtherRoutes';
import UserManagementRoutes from './UserManagementRoutes';
import UserProfileRoute from './UserProfileRoute';
import ProtectedRoute from '../components/ProtectedRoute';

// ==============================|| ROUTING RENDER ||============================== //

const protectedRoutes = [
  NavigationRoutes,
  UserManagementRoutes,
  ComponentsRoutes,
  FormsRoutes,
  TablesRoutes,
  ChartMapRoutes,
  PagesRoutes,
  UserProfileRoute,
  MasterManagementRoutes
];

const router = createBrowserRouter(
  [OtherRoutes,PagesRoutes,{
      element: <ProtectedRoute />, 
      children: protectedRoutes
    }],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
