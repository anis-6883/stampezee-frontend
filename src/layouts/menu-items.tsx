import { routes } from '@/config/routes';
import { BsPatchCheck, BsQuestionCircle, BsShop } from 'react-icons/bs';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { HiOutlineCog8Tooth } from 'react-icons/hi2';
import { IoDiamondOutline } from 'react-icons/io5';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { LuLayoutDashboard, LuListChecks, LuUserCog, LuUsers } from 'react-icons/lu';
import { MdOutlineCurrencyExchange, MdOutlineQrCodeScanner } from 'react-icons/md';
import { PiBellRinging, PiStamp, PiSyringeLight } from 'react-icons/pi';
import { RiContactsLine, RiCoupon4Line, RiMoneyDollarCircleLine, RiRefund2Line } from 'react-icons/ri';
import { TbUserShield } from 'react-icons/tb';

export const menuItems: { [key: string]: any } = {
  super_admin: [
    {
      name: 'Dashboard',
      href: routes.privateRoutes.superAdmin.dashboard,
      icon: <LuLayoutDashboard />,
    },
    {
      name: 'Retailers',
      href: routes.privateRoutes.superAdmin.retailer?.home,
      icon: <BsShop />,
    },
    {
      name: 'Subscriptions',
      href: routes.privateRoutes.superAdmin.subscription.home,
      icon: <IoDiamondOutline />,
    },

    {
      name: 'Coupons',
      href: routes.privateRoutes.superAdmin.coupon.home,
      icon: <RiCoupon4Line />,
    },
    {
      name: 'Payments',
      href: routes.privateRoutes.superAdmin.payment.home,
      icon: <RiMoneyDollarCircleLine />,
    },
    {
      name: 'Refunds',
      href: routes.privateRoutes.superAdmin.refund,
      icon: <RiRefund2Line />,
    },
    {
      name: 'Customers',
      href: routes.privateRoutes.superAdmin.customer.home,
      icon: <LuUsers />,
    },
    {
      name: 'Scans',
      href: routes.privateRoutes.superAdmin.scan,
      icon: <MdOutlineQrCodeScanner />,
    },
    {
      name: 'Push Notifications',
      href: routes.privateRoutes.superAdmin.notification,
      icon: <PiBellRinging />,
    },
    {
      name: 'Critical Payments',
      href: routes.privateRoutes.superAdmin.criticalPayment.home,
      icon: <PiSyringeLight />,
    },
    {
      name: 'Currency Exchange Rate',
      href: routes.privateRoutes.superAdmin.currencyExchange?.home,
      icon: <MdOutlineCurrencyExchange />,
    },
    {
      name: 'Stamp Categories',
      href: routes.privateRoutes.superAdmin.stampCategory.home,
      icon: <LuListChecks />,
    },
    {
      name: 'Default Stamp Images',
      href: routes.privateRoutes.superAdmin.stampImage.home,
      icon: <BsPatchCheck />,
    },
    {
      name: 'FAQs',
      href: routes.privateRoutes.superAdmin.faq.home,
      icon: <BsQuestionCircle />,
    },
    {
      name: 'Contacts',
      href: routes.privateRoutes.superAdmin.contact,
      icon: <RiContactsLine />,
    },

    {
      name: 'General Settings',
      href: routes.privateRoutes.superAdmin.settings,
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
      name: 'Plans & Add-on',
      href: routes.privateRoutes.retailer.membershipPlan,
      icon: <IoDiamondOutline />,
    },
    {
      name: 'Billing',
      href: routes.privateRoutes.retailer.billing.home,
      icon: <FaMoneyBillTransfer />,
    },
    {
      name: 'Refunds',
      href: routes.privateRoutes.retailer.refund,
      icon: <RiRefund2Line />,
    },
    {
      name: 'Branches',
      href: routes.privateRoutes.retailer.branch.home,
      icon: <LiaMapMarkedAltSolid />,
    },
    {
      name: 'Sub-Admins',
      href: routes.privateRoutes.retailer.sub_admin.home,
      icon: <TbUserShield />,
    },
    {
      name: 'Stamps',
      href: routes.privateRoutes.retailer.stamp.home,
      icon: <PiStamp />,
    },
    {
      name: 'Scans',
      href: routes.privateRoutes.retailer.scan,
      icon: <MdOutlineQrCodeScanner />,
    },
    {
      name: 'Customers',
      href: routes.privateRoutes.retailer.customer.home,
      icon: <LuUsers />,
    },
    {
      name: 'Custom Stamp Images',
      href: routes.privateRoutes.retailer.stampImage.home,
      icon: <BsPatchCheck />,
    },
    {
      name: 'Push Notifications',
      href: routes.privateRoutes.retailer.regularNotification.home,
      icon: <PiBellRinging />,
      dropdownItems: [
        {
          name: 'Regular',
          href: routes.privateRoutes.retailer.regularNotification.home,
          icon: <PiBellRinging />,
        },
        {
          name: 'Location Based',
          href: routes.privateRoutes.retailer.locationBasedNotification.home,
          icon: <PiBellRinging />,
        },
      ],
    },
    {
      name: 'Manage Profile',
      href: routes.privateRoutes.retailer.profile,
      icon: <LuUserCog />,
    },
  ],
};
