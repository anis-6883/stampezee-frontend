import { routes } from '@/config/routes';
import { BsQuestionCircle, BsShop } from 'react-icons/bs';
import { HiOutlineCog8Tooth } from 'react-icons/hi2';
import { IoDiamondOutline, IoImageOutline } from 'react-icons/io5';
import { LuBarChart3, LuLayoutDashboard, LuListChecks, LuUserCog, LuUsers } from 'react-icons/lu';
import { PiBellRinging, PiCurrencyDollar, PiStamp, PiTreeStructure } from 'react-icons/pi';
import { TbArrowsExchange, TbUserShield } from 'react-icons/tb';

export const menuItems: { [key: string]: any } = {
  super_admin: [
    {
      name: 'Dashboard',
      href: routes.superAdmin.dashboard,
      icon: <LuLayoutDashboard />,
    },
    {
      name: 'Customers',
      href: routes.superAdmin.customer,
      icon: <LuUsers />,
    },
    {
      name: 'Retailers',
      href: routes.superAdmin.retailer.home,
      icon: <BsShop />,
    },
    {
      name: 'Stamp Categories',
      href: routes.superAdmin.stampCategory.home,
      icon: <LuListChecks />,
    },
    {
      name: 'Stamp Images',
      href: routes.superAdmin.stampImage.home,
      icon: <PiStamp />,
    },
    {
      name: 'Subscriptions',
      href: routes.superAdmin.subscription.home,
      icon: <IoDiamondOutline />,
    },
    {
      name: 'FAQs',
      href: routes.superAdmin.faq.home,
      icon: <BsQuestionCircle />,
    },
    {
      name: 'Billings',
      href: routes.superAdmin.billing,
      icon: <PiCurrencyDollar />,
    },
    {
      name: 'General Settings',
      href: routes.superAdmin.settings,
      icon: <HiOutlineCog8Tooth />,
    },
  ],
  retailer: [
    {
      name: 'Dashboard',
      href: routes.retailer.dashboard,
      icon: <LuBarChart3 />,
    },
    {
      name: 'Customers',
      href: routes.retailer.customer.home,
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
      name: 'Stamp Images',
      href: routes.retailer.stampImage.home,
      icon: <IoImageOutline />,
    },
    {
      name: 'Push Notifications',
      href: routes.retailer.notification.home,
      icon: <PiBellRinging />,
    },
    {
      name: 'Membership Plans',
      href: routes.retailer.membershipPlan,
      icon: <IoDiamondOutline />,
    },
    {
      name: 'Branches',
      href: routes.retailer.branch.home,
      icon: <PiTreeStructure />,
    },
    {
      name: 'Manage Profile',
      href: routes.retailer.profile,
      icon: <LuUserCog />,
    },
    {
      name: 'Change Password',
      href: routes.retailer.changePassword,
      icon: <TbArrowsExchange />,
    },
  ],
};
