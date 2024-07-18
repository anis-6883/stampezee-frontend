import { routes } from '@/config/routes';
import { BsPatchCheck, BsQuestionCircle, BsShop } from 'react-icons/bs';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { HiOutlineCog8Tooth } from 'react-icons/hi2';
import { IoDiamondOutline } from 'react-icons/io5';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { LuLayoutDashboard, LuListChecks, LuUserCog, LuUsers } from 'react-icons/lu';
import { PiBellRinging, PiStamp } from 'react-icons/pi';
import { RiCoupon4Line, RiMoneyDollarCircleLine, RiRefund2Line } from 'react-icons/ri';
import { TbUserShield } from 'react-icons/tb';

export const menuItems: { [key: string]: any } = {
  super_admin: [
    {
      name: 'Dashboard',
      href: routes.superAdmin.dashboard,
      icon: <LuLayoutDashboard />,
    },
    {
      name: 'Retailers',
      href: routes.privateRoutes.superAdmin.retailer,
      icon: <BsShop />,
    },
    {
      name: 'Subscriptions',
      href: routes.superAdmin.subscription.home,
      icon: <IoDiamondOutline />,
    },
    {
      name: 'Coupons',
      href: routes.superAdmin.coupon.home,
      icon: <RiCoupon4Line />,
    },
    {
      name: 'Payments',
      href: routes.privateRoutes.superAdmin.payment,
      icon: <RiMoneyDollarCircleLine />,
    },
    {
      name: 'Refunds',
      href: routes.privateRoutes.superAdmin.refund,
      icon: <RiRefund2Line />,
    },
    {
      name: 'Customers',
      href: routes.superAdmin.customer,
      icon: <LuUsers />,
    },
    {
      name: 'Stamp Categories',
      href: routes.superAdmin.stampCategory.home,
      icon: <LuListChecks />,
    },
    {
      name: 'Default Stamp Images',
      href: routes.superAdmin.stampImage.home,
      icon: <BsPatchCheck />,
    },
    {
      name: 'FAQs',
      href: routes.superAdmin.faq.home,
      icon: <BsQuestionCircle />,
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
      href: routes.privateRoutes.retailer.dashboard,
      icon: <LuLayoutDashboard />,
    },
    {
      name: 'Plans & AddOns',
      href: routes.privateRoutes.retailer.membershipPlan,
      icon: <IoDiamondOutline />,
    },
    {
      name: 'Billing',
      href: routes.privateRoutes.retailer.billing,
      icon: <FaMoneyBillTransfer />,
    },
    {
      name: 'Refunds',
      href: routes.privateRoutes.retailer.refund,
      icon: <RiRefund2Line />,
    },
    {
      name: 'Branches',
      href: routes.retailer.branch.home,
      icon: <LiaMapMarkedAltSolid />,
    },
    {
      name: 'Sub-Admins (Team)',
      href: routes.retailer.sub_admin.home,
      icon: <TbUserShield />,
    },
    {
      name: 'Stamps',
      href: routes.retailer.stamp.home,
      icon: <PiStamp />,
    },
    {
      name: 'Customers',
      href: routes.retailer.customer.home,
      icon: <LuUsers />,
    },
    {
      name: 'Custom Stamp Images',
      href: routes.retailer.stampImage.home,
      icon: <BsPatchCheck />,
    },
    {
      name: 'Push Notifications',
      href: routes.retailer.notification.home,
      icon: <PiBellRinging />,
      dropdownItems: [
        {
          name: 'Regular',
          href: routes.privateRoutes.retailer.regularNotification.home,
        },
        {
          name: 'Location Based',
          href: routes.privateRoutes.retailer.locationBasedNotification.home,
        },
      ],
    },
    {
      name: 'Manage Profile',
      href: routes.retailer.profile,
      icon: <LuUserCog />,
    },
  ],
};
