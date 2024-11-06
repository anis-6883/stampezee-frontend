import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { BsCheckCircle } from 'react-icons/bs';
import OrderSession from './_components/OrderSession';

export default async function OrderComplete() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === ROLE.SUPER_ADMIN) {
    redirect(routes.privateRoutes.superAdmin.dashboard);
  }
  const t = await getTranslations('PaymentCompletePage');
  return (
    <div className="mx-auto mt-20 flex h-screen max-w-[1300px] items-center justify-center border">
      <div className="p-4">
        <div className="flex flex-col items-center">
          <BsCheckCircle className="h-24 w-24 text-green-600" />
          <h2 className="mb-4 mt-8 text-center text-xl font-bold">{t('title')}</h2>
          <OrderSession />
        </div>
      </div>
    </div>
  );
}
