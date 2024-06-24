'use client';

import { useGetOwnProfileQuery, useLogoutUserMutation } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcFaq } from 'react-icons/fc';
import { IoBagAdd, IoPricetagsSharp } from 'react-icons/io5';
import { MdOutlineContacts } from 'react-icons/md';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button } from 'rizzui';
import './HeaderStyle.css';

export default function HeaderContent() {
  const [sidBer, setSidBer] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const { push } = useRouter();
  const { authSlice }: any = useSelector((state) => state);

  const { replace } = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: RootState) => ({
      user: state.authSlice.user,
    }),
    shallowEqual
  );
  const {} = useGetOwnProfileQuery({});
  const [logOut] = useLogoutUserMutation();
  const handleLogout = async () => {
    logOut(null)
      .then((res) => {
        replace('/');
        dispatch(setValue({ target: 'user', value: undefined }));
      })
      .catch((err) => {
        console.log(err);
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

  /**
   * Checks if the current URL path matches the provided path.
   * @param path - The path to check against the current URL.
   * @returns `true` if the current URL path matches the provided path, `false` otherwise.
   */
  function checkActiveButton(path: string) {
    // Check if the current URL path matches the provided path
    // If it does, return true, otherwise return false
    if (currentUrl === path && currentUrl !== '') {
      return true;
    } else {
      return false;
    }
  }

  function routeCheck(names: string) {
    setCurrentUrl(names);
  }
  return (
    <div>
      <nav className={`fixed left-0 top-0 z-10 w-full ${isScrolled ? 'bg-gopacity-30 bg-white text-white' : 'bg-gopacity-60 bg-white'}`}>
        <div className={`${sidBer ? '' : ''} mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2`}>
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="images/logo.png" className="h-12" alt="stamp-ezee Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          </Link>
          <div className="flex items-center space-x-3 md:order-2 md:space-x-0">
            <div className="mr-3 ">
              <div
                onClick={() => setSidBer(sidBer == true && !sidBer)}
                className={`${sidBer ? 'fixed -top-2 left-0 h-[101vh] w-full overflow-hidden bg-[#14131385] transition-all duration-300 ease-in-out' : 'hidden'} z-10 items-center justify-between md:order-1 md:flex md:w-auto`}
                id="navbar-cta"
              >
                {sidBer ? (
                  <div className="transition-all duration-300 ease-in-out">
                    <ul className="h-[100vh] w-[252px] bg-white ">
                      <li>
                        <Link href="/" className="mb-5 flex items-center space-x-3 pl-4  rtl:space-x-reverse">
                          <img src="images/logo.png" className="mt-4 h-14" alt="stamp-ezee Logo" />
                          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
                        </Link>
                      </li>
                      <li className="transition duration-300 ease-in-out hover:bg-gray-100">
                        <Link
                          onClick={() => routeCheck('')}
                          href="/#how_work"
                          className={`relative block rounded py-3 pl-4 transition-all duration-150 ease-in ${checkActiveButton('') ? 'text-red-500 after:absolute after:left-1/2 after:top-[100%] after:mt-0.5 after:block after:-translate-x-1/2 after:transform after:content-["-_"]' : 'hover:text-gray-500'} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <IoBagAdd className="mr-3 text-[20px]" />
                          How It Works
                        </Link>
                      </li>
                      <li className="transition duration-300 ease-in-out hover:bg-gray-100">
                        <Link
                          onClick={() => routeCheck('/pricing')}
                          href="/pricing"
                          className={`relative block rounded py-3 pl-4 transition-all duration-150 ease-in ${checkActiveButton('/pricing') ? 'text-red-500 after:absolute after:left-1/2 after:top-[100%] after:mt-0.5 after:block after:-translate-x-1/2 after:transform after:content-["-_"]' : 'hover:text-gray-500'} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <IoPricetagsSharp className="mr-3 text-[20px]" />
                          Pricing
                        </Link>
                      </li>
                      <li className="transition duration-300 ease-in-out hover:bg-gray-100">
                        <Link
                          onClick={() => routeCheck('/faqs')}
                          href="/faqs"
                          className={`relative block rounded py-3 pl-4 transition-all duration-150 ease-in ${checkActiveButton('/faqs') ? 'text-red-500 after:absolute after:left-1/2 after:top-[100%] after:mt-0.5 after:block after:-translate-x-1/2 after:transform after:content-["-_"]' : 'hover:text-gray-500'} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <FcFaq className="mr-3 text-[20px]" />
                          FAQ
                        </Link>
                      </li>
                      <li className="transition duration-300 ease-in-out hover:bg-gray-100">
                        <Link
                          onClick={() => routeCheck('/contact-us')}
                          href="/contact-us"
                          className={`relative block rounded py-3 pl-4 transition-all duration-150 ease-in ${checkActiveButton('/contact-us') ? 'text-red-500 after:absolute after:left-1/2 after:top-[100%] after:mt-0.5 after:block after:-translate-x-1/2 after:transform after:content-["-_"]' : 'hover:text-gray-500'} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <MdOutlineContacts className="mr-3 text-[20px]" />
                          Contact
                        </Link>
                      </li>

                      <li className="mt-5 flex w-full items-center justify-center text-center">
                        <button
                          type="button"
                          className="dark:hover:bg[#454F5B] bg-primary-red dark:bg-primary-red mt-3 w-10/12 rounded-lg px-4 py-2 text-center text-sm font-medium text-white duration-300 ease-in-out hover:bg-[#454F5B] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-[#454F5B]"
                        >
                          Dashboard
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <ul
                    className={`${sidBer ? 'h-full' : ''} mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 bg-transparent p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8  md:border-0 md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse`}
                  >
                    <li className="w-max-content">
                      <Link
                        onClick={() => routeCheck('/')}
                        href="/"
                        className={`relative transition-all duration-150 ease-in ${checkActiveButton('/') ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-slate-300'}`}
                      >
                        Home
                      </Link>
                    </li>
                    <li className="w-max-content">
                      <Link
                        onClick={() => routeCheck('/pricing')}
                        href="/pricing"
                        className={`relative transition-all duration-150 ease-in ${checkActiveButton('/pricing') ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-slate-300'}`}
                      >
                        Price
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faqs"
                        onClick={() => routeCheck('/faqs')}
                        className={`relative transition-all duration-150 ease-in ${checkActiveButton('/faqs') ? 'text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-gray-500'}`}
                      >
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => routeCheck('/contact-us')}
                        href="/contact-us"
                        className={`relative transition-all duration-150 ease-in ${checkActiveButton('/contact-us') ? ' text-red-500 after:absolute after:left-1/2 after:top-full after:-mt-[7px] after:block after:-translate-x-1/2 after:transform after:content-["-_"] hover:text-red-300' : 'hover:text-slate-300'}`}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* user menu section */}

            <div className="flex gap-2">
              {user ? (
                <Link href="root/retailer/dashboard" className=" my-auto rounded-xl bg-[#EF4444] p-2 text-white">
                  Dashboard
                </Link>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => push('root/retailer/login')}
                  className={` border-[#EF4444]  ${!isScrolled ? 'text-black' : 'text-white'}`}
                >
                  Login
                </Button>
              )}
              {user && (
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="ml-2">
                      <Image
                        src={user?.image ? user?.image : '/images/man.png'}
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
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
