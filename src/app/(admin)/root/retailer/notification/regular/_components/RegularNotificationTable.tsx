'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetAllNotificationQuery } from '@/features/retailer/notification/notificationApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { Skeleton } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { IoAlarmOutline } from 'react-icons/io5';
import CreateUpdateModel from './CreateUpdateModel';

export default function RegularNotificationTable({ offset, locale }: { offset: number; locale: string }) {
  const t = useTranslations('RegularNotificationTable');
  const t2 = useTranslations('SendAndResendNotification');
  const { data: session }: any = useSession();
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllNotificationQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    type: 'all',
    ...searchQuery,
  });

  useEffect(() => {
    if (session?.user?.totalRegularNotification === 0) {
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
      Cell: ({ row }: any) => (
        <div>
          <p>{row?.original?.title}</p>
        </div>
      ),
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
    {
      header: t('sendTime'),
      Cell: ({ row }: any) => <div className="text-md mx-auto text-start">{convertDateByOffset(row?.original?.createdAt, offset)}</div>,
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 150,
    },
    {
      header: t('actions'),
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            className="!m-0 !px-3 !py-2 !text-xs"
            text={t2('resend')}
            color="danger"
            preIcon={<FaRegPaperPlane className="text-base" />}
            onClick={() => {
              setFormData({
                ...row.original,
                image: row.original.image ? `${row.original.image}` : null,
              });
              setCreateState(true);
            }}
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
      <CreateUpdateModel
        setFormData={setFormData}
        formData={formData}
        modalState={createState}
        setModalState={setCreateState}
        locale={locale}
      />
      <div className="mb-4 flex justify-between">
        <div className="flex items-center gap-x-2 rounded-lg border border-light px-3">
          <IoAlarmOutline className="text-xl" />
          <h2 className="flex items-center gap-x-1 font-semibold">
            {t('regularNotificationSendLimit')} :
            {isLoading ? (
              <Skeleton className="h-4 w-4 rounded" />
            ) : (
              <span className="font-bold text-danger">{data?.data?.notificationLimit}</span>
            )}
          </h2>
        </div>
        <Button
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
    </>
  );
}
