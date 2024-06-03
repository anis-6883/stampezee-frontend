import { routes } from '@/config/routes';
import { BsShop } from 'react-icons/bs';
import { HiOutlineCog8Tooth } from 'react-icons/hi2';
import { IoDiamondOutline, IoDuplicate, IoImageOutline } from 'react-icons/io5';
import { LuBarChart3, LuUserCog, LuUsers } from 'react-icons/lu';
import { MdQrCodeScanner } from 'react-icons/md';
import { PiBellRinging, PiCurrencyDollar, PiNewspaperClippingLight, PiStamp, PiTreeStructure } from 'react-icons/pi';
import { TbUserShield } from 'react-icons/tb';

export const menuItems: { [key: string]: any } = {
  super_admin: [
    {
      name: 'Analytics',
      href: routes.superAdmin.dashboard,
      icon: <LuBarChart3 />,
    },
    {
      name: 'Customers',
      href: routes.superAdmin.dashboard,
      icon: <LuUsers />,
    },
    {
      name: 'Retailers',
      href: routes.superAdmin.dashboard,
      icon: <BsShop />,
    },
    {
      name: 'Scans',
      href: routes.superAdmin.dashboard,
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
      href: routes.superAdmin.dashboard,
      icon: <PiBellRinging />,
    },
    {
      name: 'Billings',
      href: routes.superAdmin.dashboard,
      icon: <PiCurrencyDollar />,
    },
    {
      name: 'Pages',
      href: routes.superAdmin.dashboard,
      icon: <PiNewspaperClippingLight />,
    },
    {
      name: 'General Settings',
      href: routes.superAdmin.dashboard,
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
      href: routes.retailer.dashboard,
      icon: <LuUsers />,
    },
    {
      name: 'Sub-Admins',
      href: routes.retailer.sub_admin.home,
      icon: <TbUserShield />,
    },
    {
      name: 'Stamps',
      href: routes.retailer.stamp.home,
      icon: <PiStamp />,
    },
    {
      name: 'Stamps Images',
      href: routes.retailer.stampImage.home,
      icon: <IoImageOutline />,
    },
    {
      name: 'Push Notifications',
      href: routes.retailer.dashboard,
      icon: <PiBellRinging />,
    },
    {
      name: 'Membership Plans',
      href: routes.retailer.dashboard,
      icon: <IoDiamondOutline />,
    },
    {
      name: 'Branches',
      href: routes.retailer.branch.home,
      icon: <PiTreeStructure />,
    },
    {
      name: 'Manage Profile',
      href: routes.retailer.dashboard,
      icon: <LuUserCog />,
    },
  ],
};
