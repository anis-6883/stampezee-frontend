import { menuItems } from '@/layouts/menu-items';

const retailerMenuItems = menuItems?.retailer?.reduce((acc: Array<any>, curr: any) => {
  if (curr?.name === 'Push Notifications') {
    acc.push(...curr?.dropdownItems);
  } else {
    acc.push(curr);
  }
  return acc;
}, []);

// Note: do not add href in the label object, it is rendering as label
export const pageLinks: { [key: string]: any } = {
  super_admin: menuItems?.super_admin,
  retailer: retailerMenuItems,
};
