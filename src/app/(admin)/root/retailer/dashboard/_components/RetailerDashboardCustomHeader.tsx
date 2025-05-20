'use client';
import cn from '@/hooks/class-names';
import Link from 'next/link';
import { Title } from 'rizzui';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useTranslations } from 'next-intl';
import { HiPlus } from 'react-icons/hi2';
import { useSession } from 'next-auth/react';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';

const RetailerDashboardCustomHeader = ({ title }: { title: string }) => {
  const tStamp = useTranslations('RetailerStamp');
  const { data: session }: any = useSession();
  const { data } = useGetAllStampsQuery({ page: 1, limit: 10 });

  console.log(data);
  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7')}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
          {title}
        </Title>

        <Link href={routes.privateRoutes.retailer.stamp.create}>
          <Button
            disabled={data?.data.totalDocs < session?.user?.totalStamp ? false : true}
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
