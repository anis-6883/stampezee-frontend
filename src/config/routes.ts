export const routes = {
  home: '/project-admin',
  adminLogin: '/login',
  user: {
    profile: '/profile',
  },
  admin: {
    dashboard: '/project-admin/dashboard',
    user: {
      home: `/project-admin/users`,
      create: '/project-admin/users/create',
      edit: (id: number | string) => `/project-admin/users/update/${id}`,
    },
    retailer: {
      home: `/project-admin/retailers`,
      // create: '/project-admin/retailers/create',
      // edit: (id: number | string) => `/project-admin/retailers/update/${id}`,
    },
    manageAdmin: '/project-admin/manage-admins',
    generalSettings: '/project-admin/general-settings',
  },
  retailer: {
    dashboard: '/project-admin/dashboard',
    user: {
      home: `/project-admin/users`,
      create: '/project-admin/users/create',
      edit: (id: number | string) => `/project-admin/users/update/${id}`,
    },
  },
};
