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
    retailer: {
      home: `/root/super-admin/retailer`,
      create: `/root/super-admin/retailer/create`,
      edit: (id: number | string) => `/root/super-admin/retailer/${id}/update`,
    },
    notification: `/root/super-admin/notification`,
    billing: `/root/super-admin/billing`,
    scan: `/root/super-admin/scan`,
    customer: `/root/super-admin/customer`,
    settings: `/root/super-admin/settings`,
  },
  retailer: {
    dashboard: '/root/retailer/dashboard',
    profile: '/root/retailer/profile',
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
    customer: {
      home: `/root/retailer/customer`,
      create: '/root/retailer/customer/create',
      edit: (id: number | string) => `/root/retailer/customer/update/${id}`,
    },
    notification: {
      home: `/root/retailer/notification`,
      create: '/root/retailer/notification/create',
      edit: (id: number | string) => `/root/retailer/notification/update/${id}`,
    },
    membershipPlan: `/root/retailer/membership-plan`,
  },
};
