import { metaObject } from '@/config/site.config';
import Cryptr from 'cryptr';
import macaddress from 'macaddress';
import ContactForm from './_component/ContactForm';

export const metadata = {
  ...metaObject('Contact Us'),
};

export default async function Page() {
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
              <div className="text-center text-4xl font-bold text-[#DF2828] sm:text-left sm:text-6xl">
                <span style={{ opacity: 1, transform: 'none' }}>W</span>
                <span style={{ opacity: 1, transform: 'none' }}>h</span>
                <span style={{ opacity: 1, transform: 'none' }}>e</span>
                <span style={{ opacity: 1, transform: 'none' }}>r</span>
                <span style={{ opacity: 1, transform: 'none' }}>e</span>
              </div>
              <br />
              <div className="flex gap-3 text-4xl font-bold text-white sm:text-6xl">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>t</span>
                  <span style={{ opacity: 1, transform: 'none' }}>o</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>f</span>
                  <span style={{ opacity: 1, transform: 'none' }}>i</span>
                  <span style={{ opacity: 1, transform: 'none' }}>n</span>
                  <span style={{ opacity: 1, transform: 'none' }}>d</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>u</span>
                  <span style={{ opacity: 1, transform: 'none' }}>s</span>
                  <span style={{ opacity: 1, transform: 'none' }}>?</span>
                </div>
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="relative h-[63vh] w-full text-center">
        <img className="absolute inset-0 h-full w-full  object-cover" src="default/hero.jpg" alt="" />

        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
            <div className="bottom-[28%] sm:absolute">
              <div className="text-center text-4xl font-bold text-[#DF2828] sm:text-left sm:text-6xl">
                <span style={{ opacity: 1, transform: 'none' }}>W</span>
                <span style={{ opacity: 1, transform: 'none' }}>h</span>
                <span style={{ opacity: 1, transform: 'none' }}>e</span>
                <span style={{ opacity: 1, transform: 'none' }}>r</span>
                <span style={{ opacity: 1, transform: 'none' }}>e</span>
              </div>
              <br />
              <div className="flex gap-3 text-4xl font-bold text-white sm:text-6xl">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>t</span>
                  <span style={{ opacity: 1, transform: 'none' }}>o</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>f</span>
                  <span style={{ opacity: 1, transform: 'none' }}>i</span>
                  <span style={{ opacity: 1, transform: 'none' }}>n</span>
                  <span style={{ opacity: 1, transform: 'none' }}>d</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>u</span>
                  <span style={{ opacity: 1, transform: 'none' }}>s</span>
                  <span style={{ opacity: 1, transform: 'none' }}>?</span>
                </div>
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div> */}
      <div className="mx-4 my-10 max-w-screen-xl xl:mx-auto">
        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h1 className=" text-xl font-bold xl:text-xl">Connect with us</h1>
          <ContactForm token={encryptedString} />
        </div>
      </div>
    </div>
  );
}
