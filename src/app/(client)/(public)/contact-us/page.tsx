import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Cryptr from 'cryptr';
import macaddress from 'macaddress';
import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import ContactForm from './_component/ContactForm';

export const metadata = {
  ...metaObject('Contact Us'),
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === ROLE.SUPER_ADMIN) {
    redirect(routes.privateRoutes.superAdmin.dashboard);
  }
  const locale = await getLocale();
  const t = await getTranslations('ContactPage');
  const cryptr = new Cryptr(process.env.ENCRYPTION_KEY as string, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 12,
  });
  const mac = await macaddress.one();
  const encryptedString = cryptr.encrypt(mac);

  return (
    <div>
      <div className="relative mx-auto w-full">
        <img src="default/hero.jpg" alt="hero image" className="h-[36vh] w-full object-cover sm:h-[63vh]" />
        <div className="css-dcyb5u absolute inset-0"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
            <div className="bottom-[28%] sm:absolute">
              <div className="text-center text-3xl font-bold text-[#DF2828] sm:text-left sm:text-7xl">
                <span style={{ opacity: 1, transform: 'none' }}>{t('where')}</span>
              </div>
              <br />
              <div className="flex gap-3 text-3xl font-bold text-white sm:text-7xl">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>{t('title')}</span>
                </div>
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 my-10 max-w-screen-xl xl:mx-auto">
        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h1 className=" text-xl font-bold xl:text-3xl">{t('formTitle')}</h1>
          {encryptedString && <ContactForm token={encryptedString} locale={locale} />}
        </div>
      </div>
    </div>
  );
}
