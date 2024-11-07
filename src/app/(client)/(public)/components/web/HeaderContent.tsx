'use client';

import CustomButton from '@/components/Formik/Button';
import LocalSwitcherSelector from '@/components/Locale/LocalSwitcherSelector';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { userLoggedOut } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { resetState } from '@/features/subscription/subscriptionSlice';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import { Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import { IoLogOutOutline } from 'react-icons/io5';
import { RxCross1, RxHamburgerMenu } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Drawer, Title } from 'rizzui';
import BalanceCard from '../BalanceCard';

const mobileMenuItems = [
  {
    id: 1,
    name: 'home',
    link: '/#how_work',
  },
  {
    id: 2,
    name: 'pricing',
    link: routes.publicRoutes.pricing,
  },
  {
    id: 3,
    name: 'faq',
    link: routes.publicRoutes.faqs,
  },
  {
    id: 4,
    name: 'contact_us',
    link: routes.publicRoutes.contactUs,
  },
];

export default function HeaderContent() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });
  const { data: session }: any = useSession();
  const [sideBar, setSideBar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const { user, isLoggedIn } = useSelector((state: RootState) => state.authSlice);
  const [drawerSate, setDrawerState] = useState({ isOpen: false });
  const [modalState, setModalState] = useState<boolean>(false);

  const t = useTranslations('AppLayout');

  // Handle Logout Response
  const handleLogout = async () => {
    dispatch(userLoggedOut(undefined));

    await signOut({
      redirect: false,
      callbackUrl: '/',
    });
    dispatch(resetState());
  };

  useEffect(() => {
    setCurrentUrl(window.location.pathname); // Update currentUrl after the component mounts

    const handleResize = () => {
      if (window.innerWidth > 767) {
        setSideBar(sideBar);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let fullName = user?.firstName + ' ' + user?.lastName;

  if (fullName.length >= 18) {
    const lastName = user?.lastName ? user?.lastName.charAt(0).toUpperCase() : '';
    fullName = user?.firstName + ' ' + lastName + '.';
  }

  return (
    <div>
      <nav className={`fixed left-0 top-0 z-10 w-full ${isScrolled ? 'bg-gopacity-30 bg-white text-white' : 'bg-gopacity-60 bg-white'}`}>
        <div className={`container mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-5 py-4 sm:inset-0`}>
          <div className="w-[12%]">
            <Link href={routes.publicRoutes.home} className="flex items-center  rtl:space-x-reverse">
              <img src="/images/logo.png" className="h-10 w-10 sm:h-[74px] sm:w-[74px]" alt="logo" />
              {/* <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span> */}
            </Link>
          </div>
          <div className="flex w-[88%] items-center justify-end md:order-2 md:space-x-0">
            <span
              className="cursor-pointer  text-lg font-bold md:hidden lg:hidden"
              onClick={() =>
                setDrawerState((prevState) => ({
                  ...prevState,
                  isOpen: true,
                  placement: 'right',
                }))
              }
            >
              <RxHamburgerMenu className=" text-3xl" />
            </span>
            <div className="mr-3">
              <div
                onClick={() => setSideBar(sideBar == true && !sideBar)}
                className={`${sideBar ? 'fixed -top-2 left-0 h-[100vh] w-full overflow-hidden bg-[#14131385] bg-red-600 transition-all duration-300 ease-in-out' : 'hidden'} z-10 items-center justify-between md:order-1 md:flex md:w-auto `}
                id="navbar-cta"
              >
                <Drawer
                  isOpen={drawerSate.isOpen}
                  placement={'left'}
                  customSize={260}
                  containerClassName="bg-white opacity-95"
                  onClose={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                >
                  <div className=" transition-all duration-300 ease-in-out">
                    <div className="flex justify-end px-8 py-3">
                      <RxCross1
                        onClick={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                        className="cursor-pointer text-lg font-bold"
                      />
                    </div>
                    <ul className=" p-3 ">
                      <li className="p-3" onClick={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}>
                        <Link href="/" className="flex items-center justify-center rtl:space-x-reverse">
                          <img src="images/logo.png" className="h-24" alt="stamp-ezee Logo" />
                          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
                        </Link>
                      </li>
                      <div className="py-2">
                        <hr className="border-t-1 border-gray-400" />
                      </div>
                      {mobileMenuItems?.map((item: any) => (
                        <li
                          key={item?.id}
                          onClick={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                          className="transition duration-300 ease-in-out hover:bg-gray-100"
                        >
                          <Link
                            href={`${item.link}`}
                            className={`relative block rounded py-2 pl-4 text-base lowercase text-black transition-all duration-150 ease-in ${pathname === item.link ? 'text-red-500' : 'hover:text-gray-500'} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                          >
                            {t(item.name)}
                          </Link>
                        </li>
                      ))}

                      {!isLoggedIn ? (
                        <>
                          <li
                            onClick={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                            className=" transition duration-300 ease-in-out hover:bg-gray-100"
                          >
                            <Link
                              href="/retailer/login"
                              className={`relative block items-center rounded py-2 pl-4 text-base transition-all  duration-150 ease-in dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                            >
                              <CustomButton color="danger" text={t('login')} className="!m-0 !px-3 !py-2 !text-xs" />
                            </Link>
                          </li>
                          <li
                            onClick={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                            className=" transition duration-300 ease-in-out hover:bg-gray-100"
                          >
                            <Link
                              href="/retailer/register"
                              className={`relative block items-center rounded py-2 pl-4 text-base transition-all  duration-150 ease-in dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                            >
                              <CustomButton color="outline" text={t('signUp')} className="!m-0 !border-[#F5F5F5]  !px-3 !py-2 !text-xs" />
                            </Link>
                          </li>
                        </>
                      ) : (
                        <li className="py-4 pl-3">
                          <Link href="/root/retailer/dashboard" className=" my-auto rounded-xl bg-red-500 p-2 text-white">
                            Dashboard
                          </Link>
                        </li>
                      )}

                      {isLoggedIn && (
                        <Menu as="div" className="relative inline-block text-left">
                          <div>
                            <Menu.Button className="ml-3 py-2">
                              <img
                                src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/man.png'}
                                alt="author"
                                className="h-10 w-10 rounded-full p-1 ring-2 ring-red-300 dark:ring-red-500"
                                width={500}
                                height={500}
                              />
                            </Menu.Button>
                          </div>

                          <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className=" absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-2 px-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <div className="mb-5 flex flex-col items-center justify-center gap-y-4 border-b border-gray-300 p-6">
                                  <img
                                    src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
                                    color="danger"
                                    className="h-16 w-16 rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
                                    alt="brand"
                                  />
                                  {user?.role === ROLE.SUPER_ADMIN && (
                                    <Title as="h5" className="break-all text-center font-bold">
                                      {fullName}
                                    </Title>
                                  )}

                                  {user?.role === ROLE.RETAILER && (
                                    <Title as="h5" className="break-all text-center font-bold">
                                      {user?.storeName && user?.storeName.length > 20
                                        ? user?.storeName.slice(0, 20) + '...'
                                        : user?.storeName}
                                    </Title>
                                  )}
                                </div>

                                <Button onClick={handleLogout} variant="flat" className="h-7 w-full bg-red-500 text-white">
                                  Logout
                                </Button>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      )}

                      <li className="py-2 pl-3">
                        <AiOutlineGlobal
                          onClick={() => setModalState(true)}
                          className="h-9 w-9 cursor-pointer rounded-full p-1 ring-2 ring-[#F5F5F5] ring-offset-2 ring-offset-background"
                        />
                      </li>
                    </ul>
                    <div className="mx-3 pb-6">
                      <hr className="border-t-1 border-gray-400" />
                    </div>
                    <div className="px-4">
                      <p className="text-base">© Copyright {new Date().getFullYear()} StampEzee</p>
                      <p className="pt-1 text-base">All Rights Reserved</p>
                    </div>
                  </div>
                </Drawer>

                <ul
                  className={`${sideBar ? 'h-full' : ''} mt-4 flex flex-col items-center  gap-x-10  rounded-lg border border-gray-100 bg-gray-50 bg-transparent p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8  md:border-0 md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse`}
                >
                  <li className="w-max-content">
                    <Link
                      href="/#how_we_work"
                      className={`relative text-[20px] ${!isScrolled && 'text-black'} transition-all duration-150 ease-in ${pathname === routes.publicRoutes.home ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-500' : 'hover:text-red-500'}`}
                    >
                      {t('home')}
                    </Link>
                  </li>
                  <li className="w-max-content">
                    <Link
                      href={routes.publicRoutes.pricing}
                      className={`relative text-[20px] lowercase ${!isScrolled && 'text-black'} transition-all duration-150 ease-in ${pathname === routes.publicRoutes.pricing ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-red-500'}`}
                    >
                      {t('pricing')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faqs"
                      className={`relative text-[20px] lowercase ${!isScrolled && 'text-black'} transition-all duration-150 ease-in ${pathname === routes.publicRoutes.faqs ? 'text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-red-500'}`}
                    >
                      {t('faq')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={routes.publicRoutes.contactUs}
                      className={`relative text-[20px] lowercase ${!isScrolled && 'text-black'} transition-all duration-150 ease-in ${pathname === routes.publicRoutes.contactUs ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-red-500'}`}
                    >
                      {t('contact_us')}
                    </Link>
                  </li>
                  <div className="ms-2 flex items-center justify-center gap-x-10 space-x-8">
                    {isLoggedIn ? (
                      <Link href="/root/retailer/dashboard">
                        <CustomButton color="danger" text={t('dashboard')} className="!m-0" />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-x-10 space-x-8">
                        <Link
                          style={{ letterSpacing: '4px' }}
                          href="/retailer/login"
                          className={`min-w-max rounded-full bg-[#FF3131] px-4 py-2 text-[17px] font-bold uppercase text-white`}
                        >
                          {t('login')}
                        </Link>
                        <Link
                          style={{ letterSpacing: '4px' }}
                          href="/retailer/register"
                          className={`hover: min-w-max rounded-full border border-[#FF3131] px-4 py-2 text-[17px] font-bold uppercase transition-all duration-150 ease-in hover:bg-[#FF3131] hover:text-white ${isScrolled ? 'text-white' : 'text-black'}`}
                        >
                          {t('signUp')}
                        </Link>
                      </div>
                    )}
                    {isLoggedIn && (
                      <Menu as="div" className="relative inline-block text-left">
                        <div className="mt-1">
                          <Menu.Button className="ml-2">
                            <img
                              src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
                              alt="author"
                              className="max-h-10 max-w-10 rounded-full p-1 ring-2 ring-red-300 dark:ring-red-500"
                              width={500}
                              height={500}
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white p-2 px-4 text-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <div className="mb-5 flex flex-col items-center justify-center gap-y-4 border-b border-gray-300 p-6">
                                <img
                                  src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
                                  color="danger"
                                  className="h-16 w-16 rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
                                  alt="brand"
                                />
                                {user?.role === ROLE.SUPER_ADMIN && (
                                  <Title as="h5" className="break-all text-center font-bold">
                                    {fullName}
                                  </Title>
                                )}

                                {user?.role === ROLE.RETAILER && (
                                  <Title as="h5" className="break-all text-center font-bold">
                                    {user?.storeName && user?.storeName.length > 20
                                      ? user?.storeName.slice(0, 20) + '...'
                                      : user?.storeName}
                                  </Title>
                                )}
                              </div>
                              {session?.user?.plan && <BalanceCard />}

                              <Button
                                onClick={() => handleLogout()}
                                variant="flat"
                                className="h-10 w-full bg-[#EF4444] text-base text-white"
                              >
                                Logout <IoLogOutOutline className="ml-2 text-xl" />
                              </Button>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                    <div className="">
                      <AiOutlineGlobal
                        onClick={() => setModalState(true)}
                        className="h-8 w-8 cursor-pointer rounded-full p-1 ring-2 ring-[#F5F5F5]"
                      />
                    </div>
                    <button
                      data-collapse-toggle="navbar-cta"
                      onClick={() => setSideBar(!sideBar)}
                      type="button"
                      className={`ml-2 inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden`}
                      aria-controls="navbar-cta"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Open main menu</span>
                      <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 1h15M1 7h15M1 13h15"
                        />
                      </svg>
                    </button>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <LocalSwitcherSelector currencyExchanges={currencyExchanges} modalState={modalState} setModalState={setModalState} />
    </div>
  );
}
