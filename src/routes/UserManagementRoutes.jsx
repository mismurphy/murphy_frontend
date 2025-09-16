import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - basic component pages
const Department = Loadable(lazy(() => import('views/user_management/Department')));
const User = Loadable(lazy(() => import('views/user_management/User')));
const Rights = Loadable(lazy(() => import('views/user_management/Rights')));
const Role = Loadable(lazy(() => import('views/user_management/Role')));
const Employee = Loadable(lazy(() => import('views/user_management/Employee')));
const Document = Loadable(lazy(() => import('views/user_management/Document')));
const WorkflowTemplate = Loadable(lazy(() => import('views/user_management/WorkflowTemplate')));
const WorkflowStep = Loadable(lazy(() => import('views/user_management/WorkflowStep')));
const RoleRights = Loadable(lazy(() => import('views/user_management/RoleRights')));
const Customers = Loadable(lazy(() => import('views/user_management/Customers')));
// ==============================|| COMPONENT ROUTING ||============================== //

const UserManagementRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'user_management',
          children: [
            {
              path: 'workflow-step',
              element: <WorkflowStep />
            },
             {
              path: 'workflow-template',
              element: <WorkflowTemplate />
            },
            {
              path: 'document',
              element: <Document />
            },
            {
              path: 'employee',
              element: <Employee />
            },
            {
              path: 'department',
              element: <Department />
            },
            {
              path: 'Rights',
              element: <Rights />
            },
            {
              path: 'user',
              element: <User />
            },
            {
              path: 'role',
              element: <Role />
            },
            {
              path: 'roleRights',
              element: <RoleRights />
            },
            {
              path: 'customers',
              element: <Customers />
            }

          ]
        }
      ]
    }
  ]
};

export default UserManagementRoutes;
