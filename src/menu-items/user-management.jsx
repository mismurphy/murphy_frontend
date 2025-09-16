const userManagegment = {
  id: 'group-user-management',
  title: 'User Management',
  type: 'group',
  children: [
    {
      id: 'User',
      title: 'User Management',
      icon: <i className="ph ph-user-plus" />,
      type: 'collapse',
      children: [
        {
          id: 'WorkflowStep',
          title: 'Workflow Step',
          type: 'item',
          url: '/user_management/workflow-step'
        },
         {
          id: 'WorkflowTemplate',
          title: 'Manage Workflow',
          type: 'item',
          url: '/user_management/workflow-template'
        },
        {
          id: 'Document',
          title: 'Manage Document',
          type: 'item',
          url: '/user_management/document'
        },

        {
          id: 'Employee',
          title: 'Manage Employee',
          type: 'item',
          url: '/user_management/employee'
        },
        {
          id: 'Department',
          title: 'Manage Department',
          type: 'item',
          url: '/user_management/department'
        },
        {
          id: 'Rights',
          title: 'Manage Rights',
          type: 'item',
          url: '/user_management/rights'
        },
        {
          id: 'user',
          title: 'Manage Users',
          type: 'item',
          url: '/user_management/user'
        },
        {
          id: 'role',
          title: 'Manage Role',
          type: 'item',
          url: '/user_management/role'
        },
        {
          id: 'role_rights',
          title: 'Role Rights',
          type: 'item',
          url: '/user_management/roleRights'
        }
        ,
        {
          id: 'customers',
          title: 'customers',
          type: 'item',
          url: '/user_management/customers'
        }
      ]
    }
  ]
};

export default userManagegment;
