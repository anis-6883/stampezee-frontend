'use client';

import { routes } from '@/config/routes';
import { useGetOwnProfileQuery } from '@/features/auth/authApi';
import { RootState } from '@/features/store';
import cn from '@/hooks/class-names';
import { countDaysLeft } from '@/utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { GiSandsOfTime } from 'react-icons/gi';
import { PiCaretDownBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { Collapse, Title } from 'rizzui';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { menuItems } from './menu-items';

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: session }: any = useSession();
  const role = useSelector((state: RootState) => state.authSlice.role);
  const user = useSelector((state: RootState) => state.authSlice.user);

  const { data: profileData, isSuccess, isLoading } = useGetOwnProfileQuery(null);

  let fullName = user?.firstName + ' ' + user?.lastName;

  if (fullName.length >= 18) {
    fullName = user?.firstName + ' ' + user?.lastName.charAt(0).toUpperCase() + '.';
  }

  console.log('session', countDaysLeft(session?.user?.planValidAt));

  return (
    <aside
      className={cn(
        '2xl:w-72 fixed bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white dark:bg-gray-100/50',
        className
      )}
    >
      <div className="2xl:px-6 2xl:pt-2 sticky top-0 z-40 bg-gray-0/10 px-6 pb-2 pt-2 dark:bg-gray-100/5">
        <Link href={role === 'super_admin' ? routes.superAdmin.dashboard : routes.retailer.dashboard} aria-label="Site Logo">
          <img src="/images/logo.png" width={80} height={50} alt="logo" className="m-auto pt-2" />
        </Link>
      </div>

      <div className="mx-auto mt-4 flex w-[90%] items-center  gap-4 rounded-lg bg-[#F4F6F8] p-3">
        <img
          className="h-14 w-14 rounded-full p-2"
          src={
            user?.image
              ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}`
              : 'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png'
          }
          alt="Store Image"
        />
        <div>
          <h3 className="text-sm font-bold">{fullName ? fullName : 'Blessy J'}</h3>
          <span className="tex-sm text-gray-500">{_.startCase(_.toLower(role === 'super_admin' ? 'Super Admin' : role))}</span>
        </div>
      </div>

      <div className="mx-auto mt-4 flex w-[90%] items-center  gap-4 rounded-lg bg-[#F4F6F8] p-3">
        <div className="flex items-center justify-center">
          <GiSandsOfTime className=" text-lg" />
          <span className="pl-3 font-medium">
            {' '}
            {countDaysLeft(session?.user?.planValidAt)} days left in {session?.user?.plan}
          </span>
        </div>
      </div>

      <SimpleBar className="h-[calc(100%-80px)]">
        <div className="mt-4 pb-3 3xl:mt-6">
          {menuItems[role]?.map((item: any, index: number) => {
            const isActive =
              item.name === 'Dashboard'
                ? pathname === '/admin'
                : pathname === (item?.href as string) || pathname.includes(item?.href as string);
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
                                ? 'before:top-2/5 2xl:before:-start-5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary'
                                : 'text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700'
                            )}
                          >
                            <span className="flex items-center">
                              {item?.icon && (
                                <span
                                  className={cn(
                                    'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                    isDropdownOpen ? 'text-primary' : 'text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700'
                                  )}
                                >
                                  {item?.icon}
                                </span>
                              )}
                              {item.name}
                            </span>

                            <PiCaretDownBold
                              strokeWidth={3}
                              className={cn(
                                'h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90',
                                open && 'rotate-0 rtl:rotate-0'
                              )}
                            />
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
                                isChildActive
                                  ? 'text-primary'
                                  : 'text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900'
                              )}
                            >
                              <div className="flex items-center truncate">
                                <span
                                  className={cn(
                                    'me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                                    isChildActive ? 'bg-primary ring-[1px] ring-primary' : 'opacity-40'
                                  )}
                                />{' '}
                                <span className="truncate">{dropdownItem?.name}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </Collapse>
                    ) : (
                      <Link
                        href={item?.href}
                        className={cn(
                          '2xl:mx-5 2xl:my-2 group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1',
                          isActive
                            ? 'before:top-2/5 2xl:before:-start-5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary'
                            : 'text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90'
                        )}
                      >
                        <div className="flex items-center truncate">
                          {item?.icon && (
                            <span
                              className={cn(
                                'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                isActive ? 'text-primary' : 'text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700'
                              )}
                            >
                              {item?.icon}
                            </span>
                          )}
                          <span className="truncate">{item.name}</span>
                        </div>
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
                    {item.name}
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
