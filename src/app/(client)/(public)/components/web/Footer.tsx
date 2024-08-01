'use client';

import { routes } from '@/config/routes';

import { SerializedError } from '@/features/api/apiSlice';
import { useCreateNewsletterMutation } from '@/features/newsletter/newsletterApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from '../Image';

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [createNewsletter, { error: newsletterError, isSuccess: newsletterSuccess }] = useCreateNewsletterMutation();

  // Newsletter Response Handler
  useEffect(() => {
    if (newsletterError) {
      const myError = newsletterError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (newsletterSuccess) {
      toast.success('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }
  }, [newsletterError, newsletterSuccess]);

  const handleNewsletter = () => {
    if (email) {
      createNewsletter({ email });
    }
  };

  return (
    <div className="container mx-auto max-w-[1300px] px-3 sm:px-5">
      <footer className="container mx-auto">
        <hr className="mb-20 mt-10" />
        <div className="">
          <div className="flex flex-col items-center md:items-start ">
            <Link className="w-[60px]" href={routes.publicRoutes.home}>
              <img alt="logo" width={60} height={60} src="/images/logo.png" style={{ color: 'transparent' }} />
            </Link>
          </div>
          <div className="mt-4 block font-medium">
            <div className="mt-4 block font-medium">
              <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
                <div className="mt-4 block font-medium">
                  <div className="block text-lg font-bold">StampEzee</div>
                  <div className="flex flex-col">
                    <Link className="mt-4 w-fit font-medium" href={routes.publicRoutes.pricing}>
                      PRICING
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href="/faqs/">
                      FAQ
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href="/contact-us/">
                      CONTACT
                    </Link>
                  </div>
                </div>
                <div className="mt-4  font-medium">
                  <div className="block text-lg font-bold">Socials</div>
                  <div className="MuiStack-root css-yd8sa2 flex flex-col">
                    <Link className="mt-4 w-fit font-medium" href="#">
                      FACEBOOK
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href="#">
                      INSTAGRAM
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href="#">
                      TIKTOK
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href="#">
                      LINKEDIN
                    </Link>
                  </div>
                </div>
                <div className="mt-4 font-medium">
                  <div className="block text-lg font-bold">Contact</div>
                  <div className="MuiStack-root css-yd8sa2 flex flex-col">
                    <Link className="mt-4 w-fit font-medium" href="/terms-and-conditions/">
                      T&amp;C
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href="/privacy/">
                      PRIVACY POLICY
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href={routes.publicRoutes.contactUs}>
                      CONTACT US
                    </Link>
                  </div>
                </div>
                <div className="mt-4 flex flex-col font-medium">
                  <div className="block text-lg font-semibold">JOIN OUR NEWSLETTER</div>
                  <div className="">
                    <div
                      className=" m-0 mb-6 mt-5 flex items-center justify-center rounded-full bg-[#FFDBDB] p-3"
                      style={{ width: '100%' }}
                    >
                      <input
                        aria-invalid="false"
                        id=":r0:"
                        placeholder="Email Address"
                        className="w-[60%] rounded-md border-0 border-gray-300 bg-transparent px-4 py-2 outline-none focus:border-none focus:shadow-none focus:outline-none sm:w-full "
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        style={{
                          boxShadow: '0 0 #0000',
                        }}
                      />
                      <div className="rounded-full bg-[#E55555] px-4 py-2 text-sm font-bold text-white">
                        <button onClick={handleNewsletter} className="" type="button">
                          SUBMIT
                          <span className="" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center sm:items-start">
                    {/* <img className="MuiBox-root css-0" src="/Linkssets/images/home/Linkpp-store-badge.png" style={{ width: 200 }} />
                    <img className="MuiBox-root css-0" src="/Linkssets/images/home/google-play-badge.png" style={{ width: 200 }} /> */}

                    <Link href="/" target="_blank">
                      <Image src="/default/app-store-badge.png" alt="App Store Badge" className="h-[45px] w-[150px]" />
                    </Link>
                    <Link href="/" target="_blank">
                      <Image src="/default/google-play-badge.png" alt="Google  Store Badge" className="h-[45px] w-[150px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-2" />
          <p className="my-3 text-center">© Copyright {new Date().getFullYear()} StampEzee | All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
