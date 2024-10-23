import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ImCancelCircle } from 'react-icons/im';

export default async function OrderCancel() {
  const t = await getTranslations('PaymentCancelPage');
  return (
    <div className="mx-auto mt-20 flex h-screen max-w-[1300px] items-center justify-center border">
      <div className="p-4">
        <div className="flex flex-col items-center">
          <ImCancelCircle className="h-24 w-24 text-red-600" />
          <h2 className="mb-4 mt-8 text-center text-xl font-bold">{t('title')}</h2>
          <Link href="/root/retailer/dashboard" className="rounded-xl bg-red-500 px-4 py-2 text-white">
            {t('buttonText')}
          </Link>
        </div>
      </div>
    </div>
  );
}
