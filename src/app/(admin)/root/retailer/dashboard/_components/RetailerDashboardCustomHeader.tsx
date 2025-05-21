'use client';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import cn from '@/hooks/class-names';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import { Title } from 'rizzui';



const RetailerDashboardCustomHeader = ({ title }: { title: string }) => {
  const tStamp = useTranslations('RetailerStamp');
  const { data: session }: any = useSession();

  const { data } = useGetAllStampsQuery({ page: 1, limit: 100 });
  console.log(session, data);

  const checkedDisableStampBtn = () => {
    if(!session?.user?.plan){
      return true;
    }else if(data?.data.totalDocs >= session?.user?.totalStamp){
      return true;
    }
    return false;

}

  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7')}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
          {title}
        </Title>

        <Link href={routes.privateRoutes.retailer.stamp.create}>
          <Button
            disabled={checkedDisableStampBtn()}
            className="w-full"
            color="danger"
            text={tStamp('addNewStamp')}
            preIcon={<HiPlus className="text-base" />}
          />
        </Link>
      </div>
    </header>
  );
};

export default RetailerDashboardCustomHeader;
