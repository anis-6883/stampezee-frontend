'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import { LuCopy } from 'react-icons/lu';
import { useDeleteSuperAdminStampMutation, useGetAllSuperAdminStampsQuery } from '@/features/super-admin/stamps/superAdminStampsApi';
import DeleteStampModal from './DeleteStampModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import moment from 'moment-timezone';

export default function StampTable({ timezone, start, end, status }: { timezone: string; start: string; end: string; status: string }) {
  const t = useTranslations('RetailerStampTable');
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data: session }: any = useSession();
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};

  const queryObject: any = {
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  };
  if (start) {
    queryObject.start = start;
  }
  if (end) {
    queryObject.end = end;
  }
  if (status) {
    queryObject.status = status;
  }

  const { data, isLoading, isFetching } = useGetAllSuperAdminStampsQuery(queryObject, { skip: !accessToken });

  const [deleteStamp, { isSuccess, isError }] = useDeleteSuperAdminStampMutation();

  const handleDelete = async (rowData: any) => {
    setDeleteState(true);
    setDeleteId(rowData._id);
  };

  // delete handler
  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setDeleteState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success(t('stampDeletedSuccessfully'));
      setDeleteState(false);
      setDeleteId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'ID',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-x-2 text-start text-sm">
          <span>{row?.original?._id.slice(-5)}</span>
          <LuCopy
            className="hover:text-active cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(row?.original?._id);
              toast.success('ID Copied!');
            }}
          />
        </div>
      ),
      size: 40,
    },
    {
      header: t('info'),
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div>
            {row.original?.stampImage?.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original?.stampImage?.image}`}
                  alt="image"
                  className="h-10 w-10 rounded"
                />
              </div>
            ) : (
              <img src={'/images/logo.png'} alt="image" className="h-10 w-10 rounded" />
            )}
          </div>
          <div>
            <div className="text-md mx-auto text-start">
              <p>
                <span className="font-bold">{t('title')}:</span>{' '}
                {row?.original.title?.length >= 21 ? `${row?.original.title.slice(0, 22)}..` : row?.original.title}
              </p>
              <p>
                <span className="font-bold">{t('category')}:</span> {_.startCase(_.toLower(row?.original?.category?.name))}
              </p>
              <p>
                <span className="font-bold">{t('branch')}:</span> {row?.original?.branch?.name}
              </p>
              <p>
                <span className="font-bold">{t('noOfStampsToCollect')}:</span> {row?.original?.noOfStampsToCollect}
              </p>
            </div>
          </div>
        </div>
      ),
      size: 300,
    },
    {
      header: t('reward'),
      accessorKey: 'rewardType',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">{t('rewardType')}:</span> {row?.original?.rewardType}
          </p>
          <p>
            <span className="font-bold">{t('reward')}:</span>{' '}
            {row?.original?.rewardType === 'discount' ? `${row?.original?.discountReward}%` : row?.original?.promotionReward}
          </p>
          <p>
            <span className="font-bold">{t('minPurchaseAmount')}:</span> {row?.original?.minPurchaseAmount}{' '}
            {session?.user?.businessCurrency}
          </p>
        </div>
      ),
      size: 250,
    },
    {
      header: t('validityDate'),
      Cell: ({ row }: any) => {
        return row?.original?.hasValidity ? (
          <div className="text-md mx-auto text-start">
            <p>
              <span className="font-bold">{t('startedAt')}:</span> {getFormatDateByTimezone(row?.original?.startedAt, timezone || '')}
            </p>
            <p>
              <span className="font-bold">{t('expiredAt')}:</span> {getFormatDateByTimezone(row?.original?.expiredAt, timezone || '')}
            </p>
          </div>
        ) : (
          <div className="text-md mx-auto text-start font-bold">{t('noExpiration')}</div>
        );
      },
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 250,
    },
    {
      header: t('actions'),
      Cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <Link href={routes.privateRoutes.superAdmin.stamp.edit(row.original._id, row?.original?.isPublished)}>
              <Button
                tooltip={row?.original?.isPublished ? 'View' : 'Edit'}
                color="warning"
                preIcon={<HiOutlinePencil className="text-base" />}
              />
            </Link>
            <Button tooltip="Delete" onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        // hasSerialNo={false}
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
        searchPlaceHolder={t('placeHolder')}
      />
      {/*
       <StampPublishedModal
        publishId={publishId}
        publishHandler={publishStamp}
        modalState={publishState}
        setModalState={setPublishState}
        isSubmitting={publishSubmitting}
        setIsSubmitting={setPublishSubmitting}
      /> */}

      <DeleteStampModal
        deleteId={deleteId}
        deleteHandler={deleteStamp}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
