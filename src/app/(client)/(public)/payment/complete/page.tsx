import { BsCheckCircle } from 'react-icons/bs';
import OrderSession from './_components/OrderSession';

export default function OrderComplete() {
  return (
    <div className="mx-auto mt-20 flex h-screen max-w-[1300px] items-center justify-center border">
      <div className="p-4">
        <div className="flex flex-col items-center">
          <BsCheckCircle className="h-24 w-24 text-green-600" />
          <h2 className="mb-4 mt-8 text-center text-xl font-bold">Order Completed Successfully!</h2>
          <OrderSession />
        </div>
      </div>
    </div>
  );
}
