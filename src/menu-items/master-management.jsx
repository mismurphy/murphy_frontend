// ==============================|| MENU ITEMS - UI-COMPONENTS ||============================== //

const masterManagement = {
  id: 'group-master-management',
  title: 'Master Management',
  type: 'group',
  children: [
    {
      id: 'FG Master',
      title: 'FG Master',
      icon: <i className="ph ph-package" />,
      type: 'collapse',
      children: [
        {
          id: 'fg-master',
          title: 'FG Name Creation',
          type: 'item',
          url: '/fg-master/create'
        },
        {
          id: 'fg-master',
          title: 'FG addtional attributes',
          type: 'item',
          url: '/fg-master/additional'
        }
      ]
    },
    {
      id: 'Customer',
      title: 'Customer Master',
      icon: <i className="ph ph-identification-card" />,
      type: 'collapse',
      children: [
        {
          id: 'customer-master',
          title: 'customer-master',
          type: 'item',
          url: '/Customer/customer-master'
        }
      ]
    }
  ]
};

export default masterManagement;
