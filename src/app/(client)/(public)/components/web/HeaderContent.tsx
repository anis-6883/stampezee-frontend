'use client';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FcFaq } from 'react-icons/fc';
import { IoBagAdd, IoPricetagsSharp } from 'react-icons/io5';
import { MdOutlineContacts } from 'react-icons/md';

export default function HeaderContent() {
  const [sidBer, setSidBer] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

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
      <nav
        className={`fixed left-0 top-0 z-10 w-full border-gray-200 ${isScrolled ? 'backdrop-white-sm bg-white/30' : 'backdrop-white-sm bg-white '} `}
      >
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
                          href="/"
                          className={`block rounded py-3 pl-4 ${checkActiveButton('') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <IoBagAdd className="mr-3 text-[20px]" />
                          How It Works
                        </Link>
                      </li>
                      <li className="transition duration-300 ease-in-out hover:bg-gray-100">
                        <Link
                          onClick={() => routeCheck('/pricing')}
                          href="/pricing"
                          className={`block rounded py-3 pl-4 ${checkActiveButton('/pricing') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <IoPricetagsSharp className="mr-3 text-[20px]" />
                          Pricing
                        </Link>
                      </li>
                      <li className="transition duration-300 ease-in-out hover:bg-gray-100">
                        <Link
                          onClick={() => routeCheck('/faqs')}
                          href="/faqs"
                          className={`block rounded py-3 pl-4 ${checkActiveButton('/faqs') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <FcFaq className="mr-3 text-[20px]" />
                          FAQ
                        </Link>
                      </li>
                      <li className="transition duration-300 ease-in-out hover:bg-gray-100">
                        <Link
                          onClick={() => routeCheck('/contact-us')}
                          href="/contact-us"
                          className={`block rounded py-3 pl-4 ${checkActiveButton('/contact-us') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                        >
                          <MdOutlineContacts className="mr-3 text-[20px]" />
                          Contact
                        </Link>
                      </li>
                      <li className="mt-5 flex w-full items-center justify-center text-center">
                        <button
                          type="button"
                          className="dark:hover:bg[#454F5B] mt-3 w-10/12 rounded-lg bg-primary-red px-4 py-2 text-center text-sm font-medium text-white duration-300 ease-in-out hover:bg-[#454F5B] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-primary-red dark:focus:ring-[#454F5B]"
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
                        onClick={() => routeCheck('')}
                        href="/"
                        className={`w-max-content block rounded px-3 py-2 ${checkActiveButton('') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                      >
                        {checkActiveButton('') && <p className="mr-2 h-[.40rem] w-[.40rem] rounded-full bg-red-300"></p>} How It Works
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => routeCheck('/pricing')}
                        href="/pricing"
                        className={`block rounded px-3 py-2 ${checkActiveButton('/pricing') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                      >
                        {checkActiveButton('/pricing') && <p className="mr-2 h-[.40rem] w-[.40rem] rounded-full bg-red-300"></p>} Pricing
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faqs"
                        onClick={() => routeCheck('/faqs')}
                        className={`block rounded px-3 py-2 ${checkActiveButton('/faqs') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                      >
                        {checkActiveButton('/faqs') && <p className="mr-2 h-[.40rem] w-[.40rem] rounded-full bg-red-300"></p>} FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => routeCheck('/contact-us')}
                        href="/contact-us"
                        className={`block rounded px-3 py-2 ${checkActiveButton('/contact-us') ? 'text-red-500 hover:text-red-300' : 'hover:text-gray-500 '} flex items-center dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                      >
                        {checkActiveButton('/contact-us') && <p className="mr-2 h-[.40rem] w-[.40rem] rounded-full bg-red-300"></p>} Contact
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="flex">
              <button
                type="button"
                className="dark:hover:bg[#454F5B] rounded-lg bg-primary-red px-4 py-2 text-center text-sm font-medium text-white duration-300 ease-in-out hover:bg-[#454F5B] focus:outline-none focus:ring-4 focus:ring-blue-300  dark:bg-primary-red dark:focus:ring-[#454F5B]"
              >
                Dashboard
              </button>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="ml-2">
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                  <Menu.Items className=" absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block text-sm' block px-4 py-2 font-bold
                            `}
                          >
                            customer name
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block text-sm' block px-4 py-2 font-bold text-gray-400
                            `}
                          >
                            customer123@gmail.com
                          </a>
                        )}
                      </Menu.Item>
                      <hr />
                      <br />
                      <form method="POST" action="#">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="submit"
                              className={`
                      active ? 'bg-gray-100 text-red-900' : 'text-red-700',
                      'block text-sm' w-full px-4 py-2 text-left font-bold text-red-700
                    `}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </form>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
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
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-[65px]"></div>
    </div>
  );
}
