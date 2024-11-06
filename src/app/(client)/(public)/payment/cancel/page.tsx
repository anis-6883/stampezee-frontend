import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ImCancelCircle } from 'react-icons/im';

export default async function OrderCancel() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === ROLE.SUPER_ADMIN) {
    redirect(routes.privateRoutes.superAdmin.dashboard);
  }
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
