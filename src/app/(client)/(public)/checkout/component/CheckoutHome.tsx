export const CheckoutHome = () => {
  return (
    <div className="mx-auto mt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Plan Selection */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Plan</h2>
            <p className="mb-6 text-gray-600">Select a subscription plan</p>
            <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4">
              <p className="font-medium text-blue-700">Change Plan</p>
              <p className="text-blue-700">You will be billed immediately when switching plans</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="relative rounded-lg border p-4">
                <div className="absolute right-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">Current</div>
                <h3 className="mb-2 text-xl font-semibold">Basic</h3>
                <p className="mb-2 text-lg font-bold">9.99 CAD/mo</p>
                <ul className="text-gray-600">
                  <li>✔ 1 branch</li>
                  <li>✔ Branch management</li>
                  <li>✔ 7 days trial</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 ">
              <h2 className="mb-4 text-xl font-semibold">Plan</h2>
              <p className="mb-6 text-gray-600">Select a subscription plan</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Basic Plan */}
                <div className="relative rounded-lg border p-4">
                  <div className="absolute right-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">Current</div>
                  <h3 className="mb-2 text-xl font-semibold">Basic</h3>
                  <p className="mb-2 text-lg font-bold">9.99 CAD/mo</p>
                  <ul className="text-gray-600">
                    <li>✔ 1 branch</li>
                    <li>✔ Branch management</li>
                    <li>✔ 7 days trial</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex justify-between">
                <span>Unused time on Pro Subscription after 30 Apr 2024</span>
                <span className="text-red-500">-19.96 CAD</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Remaining time on Basic Subscription after 30 Apr 2024</span>
                <span className="text-green-500">9.98 CAD</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Subtotal</span>
                <span className="text-red-500">-9.98 CAD</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Discount</span>
                <span className="text-red-500">-0 CAD</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Tax</span>
                <span>0 CAD</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-red-500">-9.98 CAD</span>
              </div>
            </div>
            <button className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white">Complete Change Plan</button>
            <button className="mt-2 w-full rounded bg-gray-300 px-4 py-2 text-gray-700">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
