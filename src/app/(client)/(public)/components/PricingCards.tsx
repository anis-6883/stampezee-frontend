export default function PricingCards({ item }: { item: any }) {
  return (
    <div>
      {/* Pricing Card */}
      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col rounded-lg border-gray-100 bg-white p-6 text-gray-900 shadow-lg dark:bg-gray-800 dark:text-white xl:p-8">
        <h3 className="mb-4 text-2xl font-semibold">{item.plan_name}</h3>
        <div className="my-8 flex items-baseline">
          <span className="mr-2 text-3xl font-bold xl:text-5xl  xl:font-extrabold ">
            {' '}
            <sup className="font-medium capitalize">{item.currency}</sup>
            {item.pricing}
          </span>
          <span className="text-gray-500 dark:text-gray-400">/{item.duration}</span>
        </div>
        {/* List */}
        <ul role="list" className="mb-[75px] space-y-4 text-left ">
          {item.package_information.map((info: any) => (
            <li className="flex items-center space-x-3" key={info}>
              {/* Icon */}
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{info}</span>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="absolute bottom-[51px] left-[10%] w-[80%] rounded-lg border-0 bg-red px-5 py-2.5 text-center text-sm font-medium text-white transition-all duration-300 ease-in-out hover:bg-red-400 hover:text-black focus:ring-4  focus:ring-transparent  dark:text-white dark:focus:ring-red"
        >
          Get started
        </a>
      </div>
    </div>
  );
}
