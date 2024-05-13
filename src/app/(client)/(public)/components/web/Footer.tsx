import Link from 'next/link';
import Image from '../Image';

export default function Footer() {
  return (
    <div className="container mx-auto max-w-screen-xl px-3 sm:px-5">
      <footer className="container mx-auto">
        <hr className="mb-20 mt-10" />
        <div className="">
          <div className="flex flex-col items-center md:items-start ">
            <a className="w-[60px]" href="/">
              <img alt="logo" width={60} height={60} src="images/logo.png" style={{ color: 'transparent' }} />
            </a>
          </div>
          <div className="mt-4 block font-medium">
            <div className="mt-4 block font-medium">
              <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
                <div className="mt-4 block font-medium">
                  <div className="block text-lg font-bold">StampEzee</div>
                  <div className="block">
                    <a className="mt-4 block font-medium" href="/#how-it-works">
                      HOW IT WORKS
                    </a>
                    <a className="mt-4 block font-medium" href="/pricing/">
                      PRICING
                    </a>
                    <a className="mt-4 block font-medium" href="/faqs/">
                      FAQ
                    </a>
                    <a className="mt-4 block font-medium" href="/contact-us/">
                      CONTACT
                    </a>
                  </div>
                </div>
                <div className="mt-4 block font-medium">
                  <div className="block text-lg font-bold">Socials</div>
                  <div className="MuiStack-root css-yd8sa2">
                    <a className="mt-4 block font-medium" href="#">
                      FACEBOOK
                    </a>
                    <a className="mt-4 block font-medium" href="#">
                      INSTAGRAM
                    </a>
                    <a className="mt-4 block font-medium" href="#">
                      TIKTOK
                    </a>
                    <a className="mt-4 block font-medium" href="#">
                      LINKEDIN
                    </a>
                  </div>
                </div>
                <div className="mt-4 block font-medium">
                  <div className="block text-lg font-bold">Contact</div>
                  <div className="MuiStack-root css-yd8sa2">
                    <a className="mt-4 block font-medium" href="/terms-and-conditions/">
                      T&amp;C
                    </a>
                    <a className="mt-4 block font-medium" href="/privacy/">
                      PRIVACY POLICY
                    </a>
                    <a className="mt-4 block font-medium" href="/contact-us/">
                      CONTACT US
                    </a>
                  </div>
                </div>
                <div className="mt-4 block font-medium">
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
                        defaultValue=""
                        style={{
                          boxShadow: '0 0 #0000',
                        }}
                      />
                      <div className="rounded-full bg-[#E55555] px-4 py-2 text-sm font-bold text-white">
                        <button className="" type="button">
                          SUBMIT
                          <span className="" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    {/* <img className="MuiBox-root css-0" src="/assets/images/home/app-store-badge.png" style={{ width: 200 }} />
                    <img className="MuiBox-root css-0" src="/assets/images/home/google-play-badge.png" style={{ width: 200 }} /> */}

                    <Link href="/" target="_blank">
                      <Image src="/default/app-store-badge.png" alt="App Store Badge" className="mb-5 w-[200px]" />
                    </Link>
                    <Link href="/" target="_blank">
                      <Image src="/default/google-play-badge.png" alt="Google  Store Badge" className="w-[200px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="MuiTypography-root MuiTypography-body2 __className_4f5d18 css-1v7ytj3">© 2024. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
