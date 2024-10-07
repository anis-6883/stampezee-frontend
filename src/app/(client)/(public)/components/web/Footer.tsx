'use client';

import { routes } from '@/config/routes';

import { SerializedError } from '@/features/api/apiSlice';
import { useCreateNewsletterMutation } from '@/features/newsletter/newsletterApi';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { ImSpinner9 } from 'react-icons/im';
import Image from '../Image';

export default function Footer({ general }: any) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [createNewsletter, { error: newsletterError, isSuccess: newsletterSuccess }] = useCreateNewsletterMutation();

  const t = useTranslations('AppLayout');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // Newsletter Response Handler
  useEffect(() => {
    if (newsletterError) {
      const myError = newsletterError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || t('newsletterErrorMessage'));
    }

    if (newsletterSuccess) {
      toast.success(t('newsletterSuccessMessage'));
      setEmail('');
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsletterError, newsletterSuccess]);

  const handleNewsletter = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (email) {
      createNewsletter({ email });
    }
  };

  return (
    <div className="container mx-auto max-w-[1300px] px-3 sm:px-5">
      <footer className="container mx-auto">
        <hr className="mb-8 mt-10" />
        <div className="">
          <div className="flex flex-col items-center md:items-start ">
            <Link className="w-[60px]" href={routes.publicRoutes.home}>
              <img alt="logo" width={60} height={60} src="/images/logo.png" style={{ color: 'transparent' }} />
            </Link>
          </div>
          <div className="mt-4 block font-medium">
            <div className="mt-4 block font-medium">
              <div className={`grid grid-cols-1 gap-4 text-center md:grid-cols-2 md:text-${isRtl ? 'right' : 'left'} lg:grid-cols-4`}>
                <div className="mt-4 block font-medium">
                  <div className={`block ${isRtl ? 'text-right' : 'text-left'} text-lg font-bold sm:text-xl`}>StampEzee</div>
                  <div className="flex flex-col items-center justify-center text-xs sm:text-sm md:items-start md:justify-start">
                    <Link className="mt-4 w-fit font-medium uppercase" href={routes.publicRoutes.pricing}>
                      {t('pricing')}
                    </Link>
                    <Link className="mt-4 w-fit font-medium uppercase" href="/faqs/">
                      {t('faq')}
                    </Link>
                    {/* <Link className="mt-4 w-fit font-medium" href="/contact-us/">
                      CONTACT
                    </Link> */}
                  </div>
                </div>
                <div className="mt-4  font-medium">
                  <div className={`block ${isRtl ? 'text-right' : 'text-left'} text-lg font-bold  sm:text-xl`}> {t('socials')}</div>
                  <div className="flex flex-col items-center justify-center text-xs sm:text-sm md:items-start md:justify-start">
                    <Link className="mt-4 w-fit font-medium" href={general?.facebook}>
                      {t('facebook')}
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href={general?.instagram}>
                      {t('instagram')}
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href={general?.tiktok}>
                      {t('tiktok')}
                    </Link>
                    <Link className="mt-4 w-fit font-medium" href={general?.linkedin}>
                      {t('linkedin')}
                    </Link>
                  </div>
                </div>
                <div className="mt-4 font-medium">
                  <div className={`block ${isRtl ? 'text-right' : 'text-left'} text-lg font-bold  sm:text-xl`}>{t('contact')}</div>
                  <div className="MuiStack-root css-yd8sa2 flex flex-col items-center justify-center text-xs sm:text-sm md:items-start md:justify-start">
                    <Link className="mt-4 w-fit font-medium uppercase" href="/privacy-policy" target="_blank">
                      {t('privacy')}
                    </Link>
                    <Link className="mt-4 w-fit font-medium uppercase" href={routes.publicRoutes.contactUs}>
                      {t('contact_us')}
                    </Link>
                    <Link className="mt-4 w-fit font-medium uppercase" href="/terms" target="_blank">
                      {t('terms')}
                    </Link>
                  </div>
                </div>
                <div className="mt-4 flex flex-col font-medium">
                  <div
                    className={`block text-lg font-bold ${isRtl ? 'text-right' : 'text-left'}  ${locale === 'fr' ? 'sm:text-base' : locale === 'ru' ? 'sm:text-sm' : 'sm:text-xl'}`}
                  >
                    {t('newsletter')}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <form
                      onSubmit={handleNewsletter}
                      className=" m-0 mb-6 mt-5 flex items-center justify-center rounded-full bg-[#FFDBDB] p-3"
                      style={{ width: '100%' }}
                    >
                      <input
                        aria-invalid="false"
                        id=":r0:"
                        required
                        placeholder={t('newsletterPlaceholderText')}
                        className="w-[60%] rounded-md border-0 border-gray-300 bg-transparent px-4 py-2 outline-none focus:border-none focus:shadow-none focus:outline-none sm:w-full "
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        style={{
                          boxShadow: '0 0 #0000',
                        }}
                      />
                      <div className="rounded-full bg-[#E55555] px-4 py-2 text-sm font-bold text-white">
                        <button disabled={isSubmitting} className="flex items-center justify-center gap-1" type="submit">
                          <span className="w-auto text-sm">{t('newsletterButtonText')}</span>{' '}
                          {isSubmitting ? <ImSpinner9 className="animate-spin text-base" /> : <BsCheck2Circle className="text-base" />}
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="flex items-center justify-center sm:items-start">
                    {/* <img className="MuiBox-root css-0" src="/Linkssets/images/home/Linkpp-store-badge.png" style={{ width: 200 }} />
                    <img className="MuiBox-root css-0" src="/Linkssets/images/home/google-play-badge.png" style={{ width: 200 }} /> */}

                    <Link href={general?.iosDownloadLink} target="_blank">
                      <Image src="/default/app-store-badge.png" alt="App Store Badge" className="h-[45px] w-[150px]" />
                    </Link>
                    <Link href={general?.androidDownloadLink} target="_blank">
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
