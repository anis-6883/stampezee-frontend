'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useAllBranchQuery, useDeleteBranchMutation, useUpdateBranchStatusMutation } from '@/features/retailer/branch/branchApi';
import { IQueryType } from '@/types';
import { countDaysLeft } from '@/utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import { Badge, Switch } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';

export default function BranchTable({ offset }: { offset: number }) {
  const { data: session }: any = useSession();
  const [deleteBranch, { isSuccess, isError }] = useDeleteBranchMutation();
  const [updateStatus] = useUpdateBranchStatusMutation();
  const [modalState, setModalState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });

  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllBranchQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  // Handle Delete Response
  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setModalState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success('Branch deleted successfully!');
      setModalState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Address',
      accessorKey: 'address',
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.address.name.length > 60 ? `${row?.original?.address.name.substring(0, 60)}...` : row?.original?.address.name}
        </div>
      ),
    },
    {
      header: 'Source',
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
    },
    {
      header: 'Validity Date',
      Cell: ({ row }: any) => {
        return row?.original?.disabledBySystem ? (
          <span className="font-bold text-danger">Expired</span>
        ) : (
          <span className="font-bold text-danger">{countDaysLeft(row?.original?.enrollSubscription?.validityTo)} days left</span>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        return row?.original?.disabledBySystem ? (
          <Switch
            checked={false}
            disabled={true}
            switchClassName="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
            switchKnobClassName="bg-light"
            variant="flat"
            labelClassName="select-none"
            onIcon={<FcUnlock />}
            offIcon={<FcLock />}
          />
        ) : (
          <SwitchButton updateStatus={updateStatus} id={row?.original?._id} status={row?.original?.status} />
        );
      },
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 100,
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => {
        const { source, enrollSubscription, disabledBySystem, _id } = row?.original || {};
        const isAddonExpired = source === 'addon' && countDaysLeft(enrollSubscription?.validityTo) <= 0;
        const isSystemDisabled = disabledBySystem;
        const totalBranch = session?.user?.totalBranch;
        const totalDisabledBySystem = data?.data.docs?.filter((item: any) => item?.disabledBySystem)?.length;

        if (isAddonExpired) {
          return <Button className="!px-3 !py-2 !text-xs" color="danger" text="Renew" />;
        }

        if (isSystemDisabled) {
          return totalBranch >= totalDisabledBySystem ? (
            <Button className="!px-3 !py-2 !text-xs" color="danger" text="Activate" />
          ) : (
            <div>
              {/* <div className="mb-2 flex items-center justify-center gap-2">
                <Button disabled color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
                <Button disabled color="danger" preIcon={<ImBin className="text-base" />} />
              </div> */}
              <span className="font-semibold text-danger">Upgrade Your Plan</span>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center gap-2">
            <Link href={routes.retailer.branch.edit(_id)}>
              <Button color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
            </Link>
            <Button
              color="danger"
              preIcon={
                <ImBin
                  className="text-base"
                  onClick={() => {
                    setModalState(true);
                    setDeleteId(_id);
                  }}
                />
              }
            />
          </div>
        );
      },
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
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
        searchPlaceHolder="Search By Name"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteBranch}
        modalState={modalState}
        setModalState={setModalState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
