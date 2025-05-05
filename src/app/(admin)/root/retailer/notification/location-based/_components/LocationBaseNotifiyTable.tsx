'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/config/routes';
import { useGetAllNotificationQuery } from '@/features/retailer/notification/notificationApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { IoAlarmOutline } from 'react-icons/io5';
import { LuClock4 } from 'react-icons/lu';
import CreateUpdateModel from './CreateUpdateModel';

export default function LocationBaseNotifyTable({ locale, googleMapsApiKey }: { locale: string; googleMapsApiKey: string }) {
  const t = useTranslations('LocationBasedNotificationTable');
  const t2 = useTranslations('SendAndResendLocationBasedNotification');
  const { data: session }: any = useSession();
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllNotificationQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    type: 'location',
    ...searchQuery,
  });

  useEffect(() => {
    if (session?.user?.totalLocationNotification === 0 || !session?.user?.plan) {
      redirect(routes?.privateRoutes?.retailer?.dashboard);
    }
  }, [session]);

  const structure = [
    {
      header: t('image'),
      accessorKey: 'image',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <img src={row.original.image ?? '/images/no-img.png'} alt="image" className="h-16 w-16 rounded-md" />
        </div>
      ),
    },
    {
      header: t('title'),
      accessorKey: 'title',
      enableSorting: false,
      Cell: ({ row }: any) => <div>{row?.original?.title}</div>,
    },
    {
      header: t('description'),
      accessorKey: 'description',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>{row?.original?.description?.length >= 60 ? `${row?.original?.description?.slice(0, 60)}...` : row?.original?.description}</p>
        </div>
      ),
    },
    // {
    //   header: t('sendTime'),
    //   Cell: ({ row }: any) => <div className="text-md mx-auto text-start">{convertDateByOffset(row?.original?.createdAt, offset)}</div>,
    //   mantineTableHeadCellProps: {
    //     align: 'start',
    //   },
    //   mantineTableBodyCellProps: {
    //     align: 'center',
    //   },
    //   size: 150,
    // },
    {
      header: (
        <span className="flex items-center gap-x-2">
          <FaRegPaperPlane className="text-sm" /> Sent Time / <LuClock4 className="text-lg" /> Scheduled At
        </span>
      ),
      Cell: ({ row }: any) =>
        row?.original?.scheduleAt && new Date(row?.original?.scheduleAt) > new Date() ? (
          <div className="text-md mx-auto flex items-center gap-x-2 text-start">
            {getFormatDateByTimezone(row?.original?.scheduleAt, session?.user?.timezone?.label || 0)} <LuClock4 className="text-lg" />
          </div>
        ) : (
          <div className="text-md mx-auto flex items-center gap-x-2 text-start">
            {getFormatDateByTimezone(row?.original?.createdAt, session?.user?.timezone?.label || 0)} <FaRegPaperPlane className="text-sm" />
          </div>
        ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 150,
    },
    {
      header: t('address'),
      accessorKey: 'address.name',
    },
    {
      header: `${t('radius')}(km)`,
      accessorKey: 'radius',
    },
    {
      header: <span>{t('actions')}</span>,
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => {
              setFormData({
                ...row.original,
                address: row.original?.address?.name,
                longitude: row.original?.address?.loc?.coordinates[0]?.toString() || '',
                latitude: row.original?.address?.loc?.coordinates[1]?.toString() || '',
                image: row.original.image ? `${row.original.image}` : null,
              });
              setCreateState(true);
            }}
            className="!m-0 !px-3 !py-2 !text-xs"
            text={t2('resend')}
            color="danger"
            preIcon={<FaRegPaperPlane className="text-base" />}
          />
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 20,
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div className="flex items-center gap-x-2 rounded-lg border border-light px-3">
          <IoAlarmOutline className="text-xl" />
          <h2 className="flex items-center gap-x-1 font-semibold">
            {t('locationBasedNotificationSendLimit')}:
            {isLoading ? (
              <Skeleton className="h-4 w-4 rounded" />
            ) : (
              <span className="font-bold text-danger">{data?.data?.notificationLimit}</span>
            )}
          </h2>
        </div>
        <Button
          disabled={!data?.data?.notificationLimit}
          className="!m-0"
          color="danger"
          onClick={() => setCreateState(true)}
          text={t('sendNotification')}
          preIcon={<FaRegPaperPlane className="text-base" />}
        />
      </div>

      <Table
        isFetching={isFetching}
        isLoading={isLoading}
        response={
          isLoading
            ? {
                data: [],
                pagination: {
                  totalDocuments: 0,
                },
              }
            : {
                data: data?.data.docs || [],
                pagination: {
                  totalDocuments: data?.data.totalDocs || 0,
                },
              }
        }
        structure={structure}
        setQuery={setQuery}
        query={query}
        searchPlaceHolder={t('searchByNotificationTitle')}
      />

      <CreateUpdateModel
        googleMapsApiKey={googleMapsApiKey}
        setFormData={setFormData}
        formData={formData}
        modalState={createState}
        setModalState={setCreateState}
        locale={locale}
      />
    </>
  );
}
