import { menuItems } from '@/layouts/menu-items';

// Note: do not add href in the label object, it is rendering as label
export const pageLinks: { [key: string]: any } = {
  super_admin: menuItems?.super_admin,
  retailer: menuItems?.retailer,
};
