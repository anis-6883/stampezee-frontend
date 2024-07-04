export const routes = {
  publicRoutes: {
    home: '/',
    faqs: '/faqs',
    pricing: '/pricing',
    contactUs: '/contact-us',
    retailerLogin: '/retailer/login',
    retailerRegister: '/retailer/register',
    retailerForgotPassword: '/retailer/forgot-password',
    superAdminLogin: '/super-admin/login',
  },
  privateRoutes: {
    checkout: '/checkout',
    retailer: {
      dashboard: '/root/retailer/dashboard',
      profile: '/root/retailer/profile',
      changePassword: '/root/retailer/change-password',
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
      stamp: {
        home: `/root/retailer/stamps`,
        create: `/root/retailer/stamps/create`,
        edit: (id: number | string) => `/root/retailer/stamps/${id}/update`,
      },
      stampImage: {
        home: `/root/retailer/stamp-image`,
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
    superAdmin: {
      dashboard: '/root/super-admin/dashboard',
      stampImage: {
        home: `/root/super-admin/stamps-image`,
      },
      stampCategory: {
        home: `/root/super-admin/stamps-category`,
      },
      faq: {
        home: `/root/super-admin/faqs`,
      },
      subscription: {
        home: `/root/super-admin/subscription`,
      },
      retailer: {
        home: `/root/super-admin/retailers`,
        create: `/root/super-admin/retailers/create`,
        edit: (id: number | string) => `/root/super-admin/retailer/${id}/update`,
      },
      coupon: {
        home: `/root/super-admin/coupon`,
        create: `/root/super-admin/coupon/create`,
        edit: (id: number | string) => `/root/super-admin/coupon/${id}/update`,
      },
      notification: `/root/super-admin/notification`,
      billing: `/root/super-admin/billing`,
      scan: `/root/super-admin/scan`,
      customer: `/root/super-admin/customer`,
      settings: `/root/super-admin/settings`,
    },
  },
  home: '/project-admin',
  user: {
    profile: '/profile',
  },
  superAdmin: {
    login: '/super-admin/login',
    dashboard: '/root/super-admin/dashboard',
    stampImage: {
      home: `/root/super-admin/stamps-image`,
    },
    stampCategory: {
      home: `/root/super-admin/stamps-category`,
    },
    faq: {
      home: `/root/super-admin/faqs`,
    },
    subscription: {
      home: `/root/super-admin/subscription`,
    },
    retailer: {
      home: `/root/super-admin/retailers`,
      create: `/root/super-admin/retailers/create`,
      edit: (id: number | string) => `/root/super-admin/retailer/${id}/update`,
    },
    coupon: {
      home: `/root/super-admin/coupon`,
      create: `/root/super-admin/coupon/create`,
      edit: (id: number | string) => `/root/super-admin/coupon/${id}/update`,
    },
    notification: `/root/super-admin/notification`,
    billing: `/root/super-admin/billing`,
    scan: `/root/super-admin/scan`,
    customer: `/root/super-admin/customer`,
    settings: `/root/super-admin/settings`,
  },
  retailer: {
    login: '/retailer/login',
    register: '/retailer/register',
    dashboard: '/root/retailer/dashboard',
    profile: '/root/retailer/profile',
    changePassword: '/root/retailer/change-password',
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

    stamp: {
      home: `/root/retailer/stamps`,
      create: `/root/retailer/stamps/create`,
      edit: (id: number | string) => `/root/retailer/stamps/${id}/update`,
    },

    stampImage: {
      home: `/root/retailer/stamp-image`,
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
