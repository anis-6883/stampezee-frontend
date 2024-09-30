import { routes } from '@/config/routes';
import ProfileMenu from '@/layouts/profile-menu';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';

export default function HeaderMenuRight() {
  const t = useTranslations('AppLayout');
  return (
    <div className="ms-auto grid shrink-0 grid-cols-2 items-center gap-x-5 text-gray-700 xs:gap-x-3 ">
      <div className="text-base font-semibold text-danger">
        <Link className="flex items-center gap-x-2 " href={routes.publicRoutes.home}>
          <IoHomeOutline className="text-lg text-danger" />
          {t('goToHome')}
        </Link>
      </div>
      <ProfileMenu />
    </div>
  );
}
