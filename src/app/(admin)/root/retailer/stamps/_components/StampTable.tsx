'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/StatusIndicator';
import { routes } from '@/config/routes';
import {
  useDeleteStampMutation,
  useGetAllStampsQuery,
  usePublishStampMutation,
  useUpdateStampStatusMutation,
} from '@/features/retailer/stamp/stampApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import { IoCheckmarkCircle, IoEyeOutline } from 'react-icons/io5';
import { LuPartyPopper } from 'react-icons/lu';
import { Badge } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import StampPublishedModal from './StampPublishedModal';

export default function StampTable() {
  const t = useTranslations('RetailerStampTable');
  const tStamp = useTranslations('RetailerStamp');
  const t2 = useTranslations('RetailerBranchTable');
  const { data: session }: any = useSession();
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [publishState, setPublishState] = useState(false);
  const [publishId, setPublishId] = useState(null);
  const [publishSubmitting, setPublishSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllStampsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteStamp, { isSuccess, isError }] = useDeleteStampMutation();
  const [updateStampStatus] = useUpdateStampStatusMutation();
  const [publishStamp, { isSuccess: publishStampSuccess, isError: publishStampError }] = usePublishStampMutation();

  const handleDelete = async (rowData: any) => {
    setDeleteState(true);
    setDeleteId(rowData._id);
  };

  const handlePublishStamp = async (rowData: any) => {
    setPublishState(true);
    setPublishId(rowData?._id);
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

  // publish handler
  useEffect(() => {
    if (publishStampError) {
      setPublishSubmitting(false);
      toast.error('Something went wrong. Please try again!');
    }
    if (publishStampSuccess) {
      setPublishSubmitting(false);
      toast.success(t('stampPublishedSuccessfully'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishStampSuccess, publishStampError]);

  useEffect(() => {
    if (!session?.user?.plan || session?.user?.totalStamp === 0) {
      return redirect(routes.privateRoutes.retailer.dashboard);
    }
  }, [session]);

  const totalAllowStamp = session?.user?.totalStamp;
  const totalCreatedStamp = data?.data.totalDocs;

  const structure = [
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
      header: t2('source'),
      accessorKey: 'source',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.source === 'addon' ? (
              <Badge className="!bg-danger">{_.capitalize(row?.original?.source)}</Badge>
            ) : (
              <Badge className="bg-primary">{_.capitalize(row?.original?.source)}</Badge>
            )}
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 100,
    },
    {
      header: t('validityDate'),
      Cell: ({ row }: any) => {
        return row?.original?.hasValidity ? (
          <div className="text-md mx-auto text-start">
            <p>
              <span className="font-bold">{t('startedAt')}:</span>{' '}
              {getFormatDateByTimezone(row?.original?.startedAt, session?.user?.timezone?.label || '')}
            </p>
            <p>
              <span className="font-bold">{t('expiredAt')}:</span>{' '}
              {getFormatDateByTimezone(row?.original?.expiredAt, session?.user?.timezone?.label || '')}
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
      header: t('publish'),
      accessorKey: 'isPublished',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {!row?.original?.isPublished ? (
              <Button
                postIcon={<LuPartyPopper className="text-xl" />}
                className="!m-0 !px-3 !py-2"
                onClick={() => handlePublishStamp(row?.original)}
                color="danger"
                text={t('publishNow')}
              />
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="text-xl" /> {_.capitalize(t('published'))}
              </Badge>
            )}
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 100,
    },
    {
      header: t('status'),
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        return <SwitchButton updateStatus={updateStampStatus} id={row?.original?._id} status={row?.original?.status} />;
      },
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'start',
      },
      size: 100,
    },
    {
      header: t('actions'),
      Cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <Link href={routes.privateRoutes.retailer.stamp.clone(row.original._id)}>
              <Button
                disabled={totalCreatedStamp < totalAllowStamp ? false : true}
                tooltip="Clone"
                color="primary"
                preIcon={<FiCopy className="text-base" />}
              />
            </Link>
            <Link href={routes.privateRoutes.retailer.stamp.edit(row.original._id, row?.original?.isPublished)}>
              <Button
                tooltip={row?.original?.isPublished ? 'View' : 'Edit'}
                color="warning"
                preIcon={row?.original?.isPublished ? <IoEyeOutline className="text-base" /> : <HiOutlinePencil className="text-base" />}
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
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:flex-row md:gap-0">
        <StatusIndicator />
        <Link href={routes.privateRoutes.retailer.stamp.create}>
          <Button
            disabled={totalCreatedStamp < totalAllowStamp ? false : true}
            className="w-full"
            color="danger"
            text={tStamp('addNewStamp')}
            preIcon={<HiPlus className="text-base" />}
          />
        </Link>
      </div>
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

      <StampPublishedModal
        publishId={publishId}
        publishHandler={publishStamp}
        modalState={publishState}
        setModalState={setPublishState}
        isSubmitting={publishSubmitting}
        setIsSubmitting={setPublishSubmitting}
      />

      <DeleteConfirmModal
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
