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
