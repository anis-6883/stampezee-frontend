export const routes = {
  home: '/project-admin',
  retailerAdminLogin: '/retailer/login',
  user: {
    profile: '/profile',
  },
  superAdmin: {
    dashboard: '/root/super-admin/dashboard',
    stampImage: {
      home: `/root/super-admin/stamps-image`,
    },
    stampCategory: {
      home: `/root/super-admin/stamps-category`,
    },
  },
  admin: {
    dashboard: '/project-admin/dashboard',
    user: {
      home: `/project-admin/users`,
      create: '/project-admin/users/create',
      edit: (id: number | string) => `/project-admin/users/update/${id}`,
    },
    retailer: {
      dashboard: '/root/retailers/dashboard',

      // create: '/project-admin/retailers/create',
      // edit: (id: number | string) => `/project-admin/retailers/update/${id}`,
    },
    scans: {
      home: `/project-admin/retailers`,
      // create: '/project-admin/retailers/create',
      // edit: (id: number | string) => `/project-admin/retailers/update/${id}`,
    },
    notification: {
      home: `/project-admin/push-notifications`,
      // create: '/project-admin/retailers/create',
      // edit: (id: number | string) => `/project-admin/retailers/update/${id}`,
    },
    manageAdmin: '/project-admin/manage-admins',
    generalSettings: '/project-admin/general-settings',
  },
  retailer: {
    dashboard: '/root/retailer/dashboard',
    branch: {
      home: `/root/retailer/branch`,
      create: `/root/retailer/branch/create`,
      edit: (id: number | string) => `/root/retailer/branch/${id}/update`,
    },
    sub_admin: {
      home: `/root/retailer/sub-admin`,
      create: `/root/retailer/sub-admin/create`,
      edit: (id: number | string) => `/root/retailer/sub-admin/${id}/update`,
    },
    stampImage: {
      home: `/root/retailer/stamps-image`,
    },
    stamp: {
      home: `/root/retailer/stamp`,
      create: `/root/retailer/stamp/create`,
      edit: (id: number | string) => `/root/retailer/stamp/${id}/update`,
    },

    user: {
      home: `/project-admin/users`,
      create: '/project-admin/users/create',
      edit: (id: number | string) => `/project-admin/users/update/${id}`,
    },
  },
};
// roleRoutes

const roleRoutes = {
  retailer: ['/root/retailers/'],
  sup_admin: ['/root/super-admin'],
};
