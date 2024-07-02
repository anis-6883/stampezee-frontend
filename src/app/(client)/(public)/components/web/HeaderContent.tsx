'use client';

import { routes } from '@/config/routes';
import { userLoggedOut } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { Menu, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RxCross1, RxHamburgerMenu } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Drawer } from 'rizzui';

const mobileMenuItems = [
  {
    id: 1,
    name: 'Home',
    link: routes.publicRoutes.home,
  },
  {
    id: 2,
    name: 'Pricing',
    link: routes.publicRoutes.pricing,
  },
  {
    id: 3,
    name: 'FAQ',
    link: routes.publicRoutes.faqs,
  },
  {
    id: 4,
    name: 'Contact Us',
    link: routes.publicRoutes.contactUs,
  },
];

export default function HeaderContent() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [sidBer, setSidBer] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const { user, isLoggedIn } = useSelector((state: RootState) => state.authSlice);
  const [drawerSate, setDrawerState] = useState({ isOpen: false });

  // Handle Logout Response
  const handleLogout = async () => {
    dispatch(userLoggedOut(undefined));

    await signOut({
      redirect: false,
      callbackUrl: '/',
    });
  };

  useEffect(() => {
    setCurrentUrl(window.location.pathname); // Update currentUrl after the component mounts

    const handleResize = () => {
      if (window.innerWidth > 767) {
        setSidBer(sidBer);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const handleScroll = () => {
      if (window.scrollY > 100) {
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

  return (
    <div>
      <nav className={`fixed left-0 top-0 z-10 w-full ${isScrolled ? 'bg-gopacity-30 bg-white text-white' : 'bg-gopacity-60 bg-white'}`}>
        <div className={`mx-auto flex max-w-[1300px] flex-wrap items-center justify-between p-2`}>
          <Link href={routes.publicRoutes.home} className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/images/logo.png" className="h-14" alt="logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          </Link>
          <div className="flex items-center space-x-3 md:order-2 md:space-x-0">
            <span
              className="cursor-pointer text-lg font-bold md:hidden lg:hidden"
              onClick={() =>
                setDrawerState((prevState) => ({
                  ...prevState,
                  isOpen: true,
                  placement: 'right',
                }))
              }
            >
              <RxHamburgerMenu />
            </span>
            <div className="mr-3">
              <div
                onClick={() => setSidBer(sidBer == true && !sidBer)}
                className={`${sidBer ? 'fixed -top-2 left-0 h-[100vh] w-full overflow-hidden bg-[#14131385] bg-red-600 transition-all duration-300 ease-in-out' : 'hidden'} z-10 items-center justify-between md:order-1 md:flex md:w-auto `}
                id="navbar-cta"
              >
                <Drawer
                  isOpen={drawerSate.isOpen}
                  placement={'left'}
                  customSize="260px"
                  containerClassName="bg-white opacity-95"
                  onClose={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                >
                  <div className=" transition-all duration-300 ease-in-out">
                    <div className="flex justify-end p-5">
                      <RxCross1
                        onClick={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                        className="cursor-pointer font-bold"
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
                            className={`relative block rounded py-3 pl-4 transition-all duration-150 ease-in ${pathname === item.link ? 'text-red-500' : 'hover:text-gray-500'} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                          >
                            {item?.name}
                          </Link>
                        </li>
                      ))}

                      {isLoggedIn ? (
                        <li
                          onClick={() => setDrawerState((prevState) => ({ ...prevState, isOpen: false }))}
                          className=" transition duration-300 ease-in-out hover:bg-gray-100"
                        >
                          <Link
                            href="/retailer/login"
                            className={`relative block items-center rounded py-3 pl-4 transition-all  duration-150 ease-in dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                          >
                            Login
                          </Link>
                        </li>
                      ) : (
                        <li className="py-4 pl-3">
                          <Link href="root/retailer/dashboard" className=" my-auto rounded-xl bg-red-500 p-2 text-white">
                            Dashboard
                          </Link>
                        </li>
                      )}

                      {isLoggedIn && (
                        <Menu as="div" className="relative inline-block text-left">
                          <div>
                            <Menu.Button className="ml-2">
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
                            <Menu.Items className=" absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-2 px-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <div className="flex gap-1">
                                  <h2 className="font-bold">
                                    {user?.firstName} {user?.lastName}
                                  </h2>
                                </div>
                                <p className="mt-2 font-semibold">{user?.email}</p>
                                <hr className="mt-3" />
                                <br />
                                <Button onClick={handleLogout} variant="flat" className="h-7 w-full bg-red-500 text-white">
                                  Logout
                                </Button>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      )}
                    </ul>
                    <div className="mx-3 pb-6">
                      <hr className="border-t-1 border-gray-400" />
                    </div>
                    <div className="px-3 ">
                      <p className="text-sm">© Copyright {new Date().getFullYear()} StampEzee</p>
                      <p className="pt-1 text-sm">All Rights Reserved</p>
                    </div>
                  </div>
                </Drawer>

                <ul
                  className={`${sidBer ? 'h-full' : ''} mt-4 flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 bg-transparent p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8  md:border-0 md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse`}
                >
                  <li className="w-max-content">
                    <Link
                      href={routes.publicRoutes.home}
                      className={`relative transition-all duration-150 ease-in ${pathname === routes.publicRoutes.home ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-500' : 'hover:text-red-500'}`}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="w-max-content">
                    <Link
                      href={routes.publicRoutes.pricing}
                      className={`relative transition-all duration-150 ease-in ${pathname === routes.publicRoutes.pricing ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-red-500'}`}
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faqs"
                      className={`relative transition-all duration-150 ease-in ${pathname === routes.publicRoutes.faqs ? 'text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-red-500'}`}
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={routes.publicRoutes.contactUs}
                      className={`relative transition-all duration-150 ease-in ${pathname === routes.publicRoutes.contactUs ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-red-500'}`}
                    >
                      Contact Us
                    </Link>
                  </li>
                  <div className="ms-2 flex gap-2">
                    {isLoggedIn ? (
                      <Link href="root/retailer/dashboard" className=" my-auto rounded-xl bg-[#EF4444] p-2 text-white">
                        Dashboard
                      </Link>
                    ) : (
                      <Link href="/retailer/login" className={`relative  transition-all duration-150 ease-in hover:text-red-500`}>
                        Login
                      </Link>
                    )}
                    {isLoggedIn && (
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button className="ml-2">
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-2 px-4 text-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <div className="flex gap-1">
                                <h2 className="font-bold">
                                  {user?.firstName} {user?.lastName}
                                </h2>
                              </div>
                              <p className="mt-2 font-semibold">{user?.email}</p>
                              <hr className="mt-3" />
                              <br />
                              <Button onClick={() => handleLogout()} variant="flat" className="h-7 w-full bg-[#EF4444] text-white">
                                Logout
                              </Button>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                    <button
                      data-collapse-toggle="navbar-cta"
                      onClick={() => setSidBer(!sidBer)}
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
    </div>
  );
}
