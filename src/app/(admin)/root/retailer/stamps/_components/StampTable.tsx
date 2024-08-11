'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import {
  useDeleteStampMutation,
  useGetAllStampsQuery,
  usePublishStampMutation,
  useUpdateStampStatusMutation,
} from '@/features/retailer/stamp/stampApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { Badge } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import StampPublishedModal from './StampPublishedModal';

export default function StampTable({ offset }: { offset: number }) {
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
      toast.success('Stamp deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  // publish handler
  useEffect(() => {
    if (publishStampError) {
      setPublishSubmitting(false);
      toast.error('Something went wrong. Please try again!');
    }
    if (publishStampSuccess) {
      setPublishSubmitting(false);
      toast.success('Stamp Published successfully!');
    }
  }, [publishStampSuccess, publishStampError]);

  if (!session?.user?.plan) {
    return redirect(routes.privateRoutes.retailer.dashboard);
  }

  const structure = [
    {
      header: 'Info',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div>
            {row.original?.stampImage?.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original?.stampImage?.image}`}
                  alt="image"
                  className="h-full w-16 rounded"
                />
              </div>
            ) : (
              <img src={'/images/profile.png'} alt="image" className="h-full w-20 rounded" />
            )}
          </div>
          <div>
            <div className="text-md mx-auto text-start">
              <p>
                <span className="font-bold">Title:</span> {row?.original.title}
              </p>
              <p>
                <span className="font-bold">Category:</span> {_.startCase(_.toLower(row?.original?.category?.name))}
              </p>
              <p>
                <span className="font-bold">Branch:</span> {row?.original?.branch?.name}
              </p>
              <p>
                <span className="font-bold">No. Of Stamps To Collect:</span> {row?.original?.noOfStampsToCollect}
              </p>
            </div>
          </div>
        </div>
      ),
      size: 300,
    },
    {
      header: 'Reward',
      accessorKey: 'rewardType',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Reward Type:</span> {row?.original?.rewardType}
          </p>
          <p>
            <span className="font-bold">Reward:</span>{' '}
            {row?.original?.rewardType === 'discount' ? `${row?.original?.discountReward}%` : row?.original?.promotionReward}
          </p>
          <p>
            <span className="font-bold">Min. Purchase Amount:</span> {row?.original?.minPurchaseAmount} CAD
          </p>
        </div>
      ),
      size: 250,
    },
    {
      header: 'Validity Date',
      Cell: ({ row }: any) => {
        return row?.original?.hasValidity ? (
          <div className="text-md mx-auto text-start">
            <p>
              <span className="font-bold">Started At:</span> {convertDateByOffset(row?.original?.startedAt, offset)}
            </p>
            <p>
              <span className="font-bold">Expired At:</span> {convertDateByOffset(row?.original?.expiredAt, offset)}
            </p>
          </div>
        ) : (
          <div className="text-md mx-auto text-start font-bold">No Expiration</div>
        );
      },
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 300,
    },
    {
      header: 'Publish',
      accessorKey: 'isPublished',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {!row?.original?.isPublished ? (
              <Button className="!m-0" onClick={() => handlePublishStamp(row?.original)} color="danger" text="Publish Now" />
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="text-xl" /> {_.capitalize('published')}
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
    },
    {
      header: 'Status',
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
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => {
        return row?.original?.isPublished ? (
          <div className="flex gap-2">
            <Button disabled color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
            <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href={routes.privateRoutes.retailer.stamp.edit(row.original._id)}>
              <Button color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
            </Link>
            <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
          </div>
        );
      },
    },
  ];

  return (
    <>
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
        searchPlaceHolder="Search by Title"
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
