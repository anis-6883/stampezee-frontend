import { routes } from '@/config/routes';

// Note: do not add href in the label object, it is rendering as label
export const pageLinks: { [key: string]: any } = {
  super_admin: [
    {
      name: 'Dashboard',
      href: routes.superAdmin.dashboard,
    },
  ],
  retailer: [
    {
      name: 'Dashboard',
      href: routes.retailer.dashboard,
    },
  ],
};
