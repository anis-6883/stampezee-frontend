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
      regularNotification: {
        home: `/root/retailer/notification/regular`,
        create: '/root/retailer/notification/regular/create',
        edit: (id: number | string) => `/root/retailer/notification/regular/update/${id}`,
      },
      locationBasedNotification: {
        home: `/root/retailer/notification/location-based`,
        create: '/root/retailer/notification/regular/location-based/create',
        edit: (id: number | string) => `/root/retailer/notification/regular/location-based/update/${id}`,
      },
      membershipPlan: `/root/retailer/membership-plan`,
      billing: {
        home: `/root/retailer/billing`,
        details: (id: number | string) => `/root/retailer/billing/${id}`,
      },
      refund: `/root/retailer/refund`,
      scan: `/root/retailer/scan`,
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
        edit: (id: number | string) => `/root/super-admin/subscription/${id}/update`,
      },
      retailer: {
        home: '/root/super-admin/retailer',
        details: (id: number | string) => `/root/super-admin/retailer/${id}`,
      },
      coupon: {
        home: `/root/super-admin/coupon`,
        create: `/root/super-admin/coupon/create`,
        edit: (id: number | string) => `/root/super-admin/coupon/${id}/update`,
      },
      currencyExchange: {
        home: `/root/super-admin/currency-exchange`,
      },
      notification: `/root/super-admin/notification`,
      payment: {
        home: `/root/super-admin/payment`,
        details: (id: number | string) => `/root/super-admin/payment/${id}`,
      },
      refund: `/root/super-admin/refund`,
      scan: `/root/super-admin/scan`,
      customer: {
        home: `/root/super-admin/customer`,
        details: (id: number | string) => `/root/super-admin/customer/${id}`,
      },
      contact: `/root/super-admin/contact`,
      settings: `/root/super-admin/settings`,
    },
  },
};
