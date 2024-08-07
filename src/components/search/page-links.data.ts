import { routes } from '@/config/routes';

// Note: do not add href in the label object, it is rendering as label
export const pageLinks: { [key: string]: any } = {
  super_admin: [
    {
      name: 'Dashboard',
      href: routes.privateRoutes.superAdmin.dashboard,
    },
    {
      name: 'Retailer',
      href: routes.privateRoutes.superAdmin.retailer,
    },
    {
      name: 'Subscriptions',
      href: routes.privateRoutes.superAdmin.subscription.home,
    },
    {
      name: 'Coupons',
      href: routes.privateRoutes.superAdmin.coupon.home,
    },
    {
      name: 'Payments',
      href: routes.privateRoutes.superAdmin.payment,
    },
    {
      name: 'Refunds',
      href: routes.privateRoutes.superAdmin.refund,
    },
    {
      name: 'Customers',
      href: routes.privateRoutes.superAdmin.customer,
    },
    {
      name: 'Stamp Categories',
      href: routes.privateRoutes.superAdmin.stampCategory.home,
    },
    {
      name: 'Default Stamp Image',
      href: routes.privateRoutes.superAdmin.stampImage.home,
    },
    {
      name: 'FAQS',
      href: routes.privateRoutes.superAdmin.faq.home,
    },
    {
      name: 'Contacts',
      href: routes.privateRoutes.superAdmin.contact,
    },
    {
      name: 'General Settings',
      href: routes.privateRoutes.superAdmin.settings,
    },
  ],
  retailer: [
    {
      name: 'Dashboard',
      href: routes.privateRoutes.retailer.dashboard,
    },
    {
      name: 'Membership Plan',
      href: routes.privateRoutes.retailer.membershipPlan,
    },
    {
      name: 'Billing',
      href: routes.privateRoutes.retailer.billing,
    },
    {
      name: 'Refund',
      href: routes.privateRoutes.retailer.refund,
    },
    {
      name: 'Branch',
      href: routes.privateRoutes.retailer.branch.home,
    },
    {
      name: 'Sub Admin',
      href: routes.privateRoutes.retailer.sub_admin.home,
    },
    {
      name: 'Stamp',
      href: routes.privateRoutes.retailer.stamp.home,
    },
    {
      name: 'Scan',
      href: routes.privateRoutes.retailer.scan,
    },
    {
      name: 'Customer',
      href: routes.privateRoutes.retailer.customer.home,
    },
    {
      name: 'Custom Stamp Image',
      href: routes.privateRoutes.retailer.stampImage.home,
    },
    {
      name: 'Regular Notification',
      href: routes.privateRoutes.retailer.regularNotification.home,
    },
    {
      name: 'Location Based Notification',
      href: routes.privateRoutes.retailer.locationBasedNotification.home,
    },
    {
      name: 'Manage Profile',
      href: routes.privateRoutes.retailer.profile,
    },
  ],
};
