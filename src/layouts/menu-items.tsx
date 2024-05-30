import { routes } from '@/config/routes';
import { FaCogs, FaRegIdBadge } from 'react-icons/fa';
import { HiOutlineCog8Tooth } from 'react-icons/hi2';
import { IoDuplicate } from 'react-icons/io5';
import { LuBarChart3, LuUsers } from 'react-icons/lu';
import { MdQrCodeScanner } from 'react-icons/md';
import { PiBellRinging, PiCurrencyDollar, PiNewspaperClippingLight, PiStamp, PiTreeStructure } from 'react-icons/pi';
import { TbUserShield } from 'react-icons/tb';

export const menuItems: { [key: string]: any } = {
  super_admin: [
    {
      name: 'Analytics',
      href: routes.admin.dashboard,
      icon: <LuBarChart3 />,
    },
    {
      name: 'Customers',
      href: routes.admin.user.home,
      icon: <LuUsers />,
    },
    {
      name: 'Retailers',
      href: routes.admin.user.home,
      // icon: <BsShop />,
    },
    {
      name: 'Scans',
      href: routes.admin.scans.home,
      icon: <MdQrCodeScanner />,
    },
    {
      name: 'Stamps category',
      href: routes.superAdmin.stampCategory.home,
      icon: <IoDuplicate />,
    },
    {
      name: 'Stamps Images',
      href: routes.superAdmin.stampImage.home,
      icon: <PiStamp />,
    },
    {
      name: 'Push Notifications',
      href: routes.admin.notification.home,
      icon: <PiBellRinging />,
    },
    {
      name: 'Billings',
      href: routes.admin.user.home,
      icon: <PiCurrencyDollar />,
    },
    {
      name: 'Pages',
      href: routes.admin.user.home,
      icon: <PiNewspaperClippingLight />,
    },
    {
      name: 'General Settings',
      href: routes.admin.generalSettings,
      icon: <HiOutlineCog8Tooth />,
    },
  ],
  retailer: [
    {
      name: 'Analytics',
      href: routes.retailer.dashboard,
      icon: <LuBarChart3 />,
    },
    {
      name: 'Customers',
      href: routes.admin.user.home,
      icon: <LuUsers />,
    },
    {
      name: 'Sub-Admins',
      href: routes.retailer.sub_admin.home,
      icon: <TbUserShield />,
    },
    {
      name: 'Stamps-images',
      href: routes.retailer.stampImage.home,
      icon: <PiStamp />,
    },
    {
      name: 'Push Notifications',
      href: routes.admin.user.home,
      icon: <PiBellRinging />,
    },
    {
      name: 'Memberships',
      href: routes.admin.user.home,
      icon: <FaRegIdBadge />,
    },
    {
      name: 'Branches',
      href: routes.retailer.branch.home,
      icon: <PiTreeStructure />,
    },
    {
      name: 'Account',
      href: routes.admin.generalSettings,
      icon: <FaCogs />,
    },
  ],
};
