'use client';

import BalanceCard from '@/app/(client)/(public)/components/BalanceCard';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import cn from '@/hooks/class-names';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useWindowScroll } from '@/hooks/use-window-scroll';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { PiCaretDownBold } from 'react-icons/pi';
import { SlLock } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import { Collapse, Title } from 'rizzui';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { menuItems } from './menu-items';
import { IoCloseSharp } from 'react-icons/io5';
import { useDrawer } from '@/components/drawer-views/use-drawer';

// user has no current plan sidebar locked url list
const blockedMenuUrls = [
  routes.privateRoutes.retailer.customer.home,
  routes.privateRoutes.retailer.sub_admin.home,
  routes.privateRoutes.retailer.stamp.home,
  routes.privateRoutes.retailer.stampImage.home,
  routes.privateRoutes.retailer.branch.home,
  routes.privateRoutes.retailer.regularNotification.home,
  routes.privateRoutes.retailer.locationBasedNotification.home,
  routes.privateRoutes.retailer.scan,
];

//current plan is free trail then sidebar locked url list
const addonsBlockedMenuUrls = [
  routes.privateRoutes.retailer.stampImage.home,
  routes.privateRoutes.retailer.regularNotification.home,
  routes.privateRoutes.retailer.locationBasedNotification.home,
];

const lockedMenuNames = ['Branches', 'Custom Stamp Images', 'Regular', 'Location Based', 'Push Notifications'];

const checkedLocked = (role: string, url: string, menuName: string, user: any) => {
  // if user has current plan
  if (user?.plan) {
    // free trail checked lock
    if (user?.plan === 'trial') {
      return role === 'retailer' && addonsBlockedMenuUrls.includes(url);
    }
    // if sidebar menu name contain lockedMenuNames
    if (lockedMenuNames?.indexOf(menuName) >= 0) {
      // if sidebar menu name is Branches
      if (lockedMenuNames[lockedMenuNames?.indexOf(menuName)] === 'Branches') {
        return role === 'retailer' && blockedMenuUrls.includes(url) && lockedMenuNames?.includes(menuName) && user?.totalBranch === 0;
      }
      // if sidebar menu name is Custom Stamp Images
      if (lockedMenuNames[lockedMenuNames?.indexOf(menuName)] === 'Custom Stamp Images') {
        return (
          role === 'retailer' && blockedMenuUrls.includes(url) && lockedMenuNames?.includes(menuName) && user?.totalCustomStampImage === 0
        );
      }
      // if sidebar menu name is Regular
      if (lockedMenuNames[lockedMenuNames?.indexOf(menuName)] === 'Regular') {
        return (
          role === 'retailer' &&
          blockedMenuUrls.includes(url) &&
          lockedMenuNames?.includes(menuName) &&
          user?.totalRegularNotification === 0
        );
      }
      // if sidebar menu name is Location Based
      if (lockedMenuNames[lockedMenuNames?.indexOf(menuName)] === 'Location Based') {
        return (
          role === 'retailer' &&
          blockedMenuUrls.includes(url) &&
          lockedMenuNames?.includes(menuName) &&
          user?.totalLocationNotification === 0
        );
      }
      // if sidebar menu name is Push Notifications
      if (lockedMenuNames[lockedMenuNames?.indexOf(menuName)] === 'Push Notifications') {
        return (
          role === 'retailer' &&
          blockedMenuUrls.includes(url) &&
          lockedMenuNames?.includes(menuName) &&
          user?.totalLocationNotification === 0 &&
          user?.totalRegularNotification === 0
        );
      }
    }
    return false;
  }
  // if user has no current plan and role retailer then sidebar menu locked
  else {
    return role === 'retailer' && blockedMenuUrls.includes(url);
  }
};

export default function Sidebar({ className }: { className?: string }) {
  const t = useTranslations('RetailerSidebar');
  const { closeDrawer } = useDrawer();
  const isMounted = useIsMounted();
  const windowScroll = useWindowScroll();
  const pathname = usePathname();
  const { data: session }: any = useSession();
  const { role, user } = useSelector((state: RootState) => state.authSlice);

  let fullName = user?.firstName ? user?.firstName + ' ' + user?.lastName : '';

  if (fullName.length >= 18) {
    const lastName = user?.lastName ? user?.lastName?.charAt(0)?.toUpperCase() : '';
    fullName = user?.firstName + ' ' + lastName + '.';
  }

  return (
    <aside
      className={cn(
        '2xl:w-72 fixed bottom-0 start-0 z-[60] h-full w-[290px] overflow-auto border-e-2 border-gray-100 bg-white dark:bg-gray-100/50',
        className
      )}
    >
      {/* cross button */}
      <button onClick={() => closeDrawer()} type="button" className="absolute right-6 top-5 z-[999] text-xl sxl:hidden ">
        <IoCloseSharp />
      </button>
      <div
        className={cn(
          '2xl:py-5 sticky top-0 z-50 flex items-center justify-center bg-gray-0/80 px-4 py-4 backdrop-blur-xl dark:bg-gray-50/50 md:px-5 lg:px-6 3xl:px-8 4xl:px-10',
          ((isMounted && windowScroll.y) as number) > 2 ? 'card-shadow' : ''
        )}
      >
        <Link
          href={role === 'super_admin' ? routes.privateRoutes.superAdmin.dashboard : routes.privateRoutes.retailer.dashboard}
          aria-label="Site Logo"
        >
          <img src="/images/logo.png" width={80} height={50} alt="logo" className="m-auto pt-2" />
        </Link>
      </div>

      {role === ROLE.RETAILER && (
        <div className="m-4 flex flex-col items-center gap-4 rounded-lg bg-[#F4F6F8] p-3">
          <img
            src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
            color="danger"
            className="h-14 w-14 rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
            alt="brand"
          />
          <Title as="h6" className="break-all text-center font-bold">
            {user?.storeName && user?.storeName.length > 20 ? user?.storeName.slice(0, 20) + '...' : user?.storeName}
          </Title>
        </div>
      )}

      {role === ROLE.SUPER_ADMIN && (
        <div className="m-4 flex flex-col items-center gap-4 rounded-lg bg-[#F4F6F8] p-3">
          <img
            src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
            color="danger"
            className="h-14 w-14 rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
            alt="brand"
          />
          <Title as="h6" className="break-all text-center font-bold">
            {fullName}
          </Title>
        </div>
      )}

      {session?.user?.plan && <BalanceCard showUpButton={true} />}

      <SimpleBar>
        <div className="mt-4  pb-3 3xl:mt-6">
          {menuItems[role]?.map((item: any, index: number) => {
            const isActive = pathname === (item?.href as string) || pathname.includes(item?.href as string);
            const pathnameExistInDropdowns: any = item?.dropdownItems?.filter((dropdownItem: any) => dropdownItem.href === pathname);
            const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

            return (
              <Fragment key={item.name + '-' + index}>
                {item?.href ? (
                  <>
                    {item?.dropdownItems ? (
                      <Collapse
                        defaultOpen={isDropdownOpen}
                        header={({ open, toggle }) => (
                          <div
                            onClick={toggle}
                            className={cn(
                              '2xl:mx-5 2xl:my-2 group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1',
                              isDropdownOpen
                                ? 'before:top-2/5 2xl:before:-start-5 text-danger before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary'
                                : 'text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700',
                              checkedLocked(role, item?.href, item.name, session?.user)
                                ? 'pointer-events-none cursor-not-allowed bg-gray-100'
                                : ''
                            )}
                          >
                            <span className="flex items-center">
                              {item?.icon && (
                                <span
                                  className={cn(
                                    'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                    isDropdownOpen ? 'text-danger' : 'text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700'
                                  )}
                                >
                                  {item?.icon}
                                </span>
                              )}
                              {role === ROLE.RETAILER ? t(item?.name) : item.name}
                            </span>

                            {checkedLocked(role, item?.href, item.name, session?.user) ? (
                              <div className="text-end ">
                                <SlLock className="text-lg" />
                              </div>
                            ) : (
                              <PiCaretDownBold
                                strokeWidth={3}
                                className={cn(
                                  'h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90',
                                  open && 'rotate-0 rtl:rotate-0'
                                )}
                              />
                            )}
                          </div>
                        )}
                      >
                        {item?.dropdownItems?.map((dropdownItem: any, index: number) => {
                          const isChildActive = pathname === (dropdownItem?.href as string);

                          return (
                            <Link
                              href={dropdownItem?.href}
                              key={dropdownItem?.name + index}
                              className={cn(
                                '2xl:mx-5 mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2',

                                checkedLocked(role, dropdownItem?.href, dropdownItem.name, session?.user)
                                  ? 'pointer-events-none cursor-not-allowed bg-gray-100'
                                  : '',
                                isChildActive
                                  ? 'text-danger'
                                  : 'text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900'
                              )}
                            >
                              <div className="flex items-center truncate">
                                <span
                                  className={cn(
                                    'me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                                    isChildActive ? 'bg-danger ring-[1px] ring-danger' : 'opacity-40'
                                  )}
                                />{' '}
                                <span className="truncate">{role === ROLE.RETAILER ? t(dropdownItem?.name) : dropdownItem?.name}</span>
                              </div>
                              {checkedLocked(role, dropdownItem?.href, dropdownItem.name, session?.user) && (
                                <div className="text-end ">
                                  <SlLock className="text-lg" />
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </Collapse>
                    ) : (
                      <Link
                        href={item?.href}
                        className={cn(
                          '2xl:mx-5 2xl:my-2 group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1',
                          checkedLocked(role, item?.href, item.name, session?.user)
                            ? 'pointer-events-none cursor-not-allowed bg-gray-100'
                            : '',
                          isActive
                            ? 'before:top-2/5 2xl:before:-start-5 text-danger before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-danger'
                            : 'text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90'
                        )}
                      >
                        <div className="flex items-center truncate">
                          {item?.icon && (
                            <span
                              className={cn(
                                'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                isActive ? 'text-danger' : 'text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700'
                              )}
                            >
                              {item?.icon}
                            </span>
                          )}
                          <span className="truncate">
                            {role === ROLE.RETAILER ? t(item.name) : item.name}{' '}
                            {item.name === 'Branches' && `(${session?.user?.totalBranch || 0})`}
                            {item.name === 'Custom Stamp Images' && `(${session?.user?.totalCustomStampImage || 0})`}
                            {item.name === 'Stamp Cards' && `(${session?.user?.totalStamp || 0})`}
                          </span>
                        </div>
                        {checkedLocked(role, item?.href, item.name, session?.user) && (
                          <div className="text-end ">
                            <SlLock className="text-lg" />
                          </div>
                        )}
                      </Link>
                    )}
                  </>
                ) : (
                  <Title
                    as="h6"
                    className={cn(
                      '2xl:px-8 mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500',
                      index !== 0 && 'mt-6 3xl:mt-7'
                    )}
                  >
                    {role === ROLE.RETAILER ? t(item.name) : item.name}
                  </Title>
                )}
              </Fragment>
            );
          })}
        </div>
      </SimpleBar>
    </aside>
  );
}
