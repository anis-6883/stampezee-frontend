export default function page() {
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
      <div className="mx-auto max-w-screen-xl px-5 py-16">
        <div className="">
          <div className="">
            <div className="mb-5" style={{ opacity: 1, transform: 'none' }}>
              <h3 className="text-[#212B36 text-2xl font-bold">
                Feel free to contact us. <br />
                Well be glad to hear from you, buddy.
              </h3>
            </div>
            <div style={{ opacity: 1, transform: 'none' }}>
              {/* <a
                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedInherit MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-colorInherit MuiButton-disableElevation MuiButton-root MuiButton-contained MuiButton-containedInherit MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-colorInherit MuiButton-disableElevation css-z05i20"
                tabIndex={0}
                href="https://us18.list-manage.com/contact-form?u=08485944993f4b04168d7f89c&form_id=48c3da2c3ded7cda6bf687eb5a2f1b61"
              >
                Go to Contact Form
                <span className="MuiTouchRipple-root css-w0pj6f" />
              </a> */}
              <button
                type="button"
                className="dark:hover:bg[#454F5B] mt-3 rounded-lg bg-primary-red px-4 py-2 text-center text-sm font-medium text-white duration-300 ease-in-out hover:bg-[#454F5B] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-primary-red dark:focus:ring-[#454F5B]"
              >
                Go to Contact Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
