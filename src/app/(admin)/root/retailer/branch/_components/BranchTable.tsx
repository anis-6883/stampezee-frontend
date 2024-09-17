'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import {
  useActivateBranchMutation,
  useAllBranchQuery,
  useConvertToAddOnBranchMutation,
  useDeleteBranchMutation,
  useRenewBranchMutation,
  useUpdateBranchStatusMutation,
} from '@/features/retailer/branch/branchApi';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { IQueryType, Subscription } from '@/types';
import { countDaysLeft } from '@/utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import { IoPower } from 'react-icons/io5';
import { MdAutorenew } from 'react-icons/md';
import { SiConvertio } from 'react-icons/si';
import { Badge, Switch } from 'rizzui';
import ActivateConfirmModal from '../../../_components/ActivateConfirmModal';
import ConvertToAddOnModal from '../../../_components/ConvertToAddOnModal';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import RenewConfirmModal from '../../../_components/RenewConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';

export default function BranchTable({ offset }: { offset: number }) {
  const { data: session }: any = useSession();
  const { push } = useRouter();
  const [deleteBranch, { isSuccess, isError }] = useDeleteBranchMutation();
  const [updateStatus] = useUpdateBranchStatusMutation();
  const [activateBranch, { isSuccess: activateBranchSuccess, isError: activateBranchError }] = useActivateBranchMutation();
  const [convertToAddOnBranch, { isSuccess: convertToAddonBranchSuccess, isError: convertToAddonBranchError, error: convertAddOnError }] =
    useConvertToAddOnBranchMutation();
  const [renewBranch, { isSuccess: renewBranchSuccess, isError: renewBranchError, data: renewResponse }] = useRenewBranchMutation();
  // delete state
  const [modalState, setModalState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  // activate state
  const [activateModalState, setActivateModalState] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeSubmitting, setActiveSubmitting] = useState(false);
  // convert to add-on state
  const [convertModalState, setConvertModalState] = useState(false);
  const [convertId, setConvertId] = useState(null);
  const [convertSubmitting, setConvertSubmitting] = useState(false);
  // renew state
  const [renewModalState, setRenewModalState] = useState(false);
  const [renewId, setRenewId] = useState(null);
  const [renewSubmitting, setRenewSubmitting] = useState(false);

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 20, search: null });

  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllBranchQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const { data: subscriptionList } = useGetSubscriptionQuery(undefined);

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

  // Handle Active Branch Response
  useEffect(() => {
    if (activateBranchError) {
      setActiveSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setActivateModalState(false);
      setActiveId(null);
    }
    if (activateBranchSuccess) {
      setActiveSubmitting(false);
      toast.success('Branch activated successfully!');
      setActivateModalState(false);
      setActiveId(null);
    }
  }, [activateBranchSuccess, activateBranchError]);

  // Handle Convert To Add-on Branch Response
  useEffect(() => {
    const myError = convertAddOnError as SerializedError;
    if (convertToAddonBranchError) {
      setConvertSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!');
      setConvertModalState(false);
      setConvertId(null);
    }
    if (convertToAddonBranchSuccess) {
      setConvertSubmitting(false);
      toast.success('Branch source convert to add-on successfully!');
      setConvertModalState(false);
      setConvertId(null);
    }
  }, [convertToAddonBranchSuccess, convertToAddonBranchError, convertAddOnError]);

  // Handle Renew Branch Response
  useEffect(() => {
    if (renewBranchError) {
      setRenewSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setRenewModalState(false);
      setRenewId(null);
    }
    if (renewBranchSuccess) {
      setRenewSubmitting(false);

      if (renewResponse?.data?.url) {
        push(renewResponse?.data?.url);
      } else {
        toast.success(renewResponse?.message);
      }
      setRenewModalState(false);
      setRenewId(null);
    }
  }, [renewBranchSuccess, renewBranchError, renewResponse, push]);

  if (session?.user?.totalBranch === 0) {
    return redirect(routes.privateRoutes.retailer.dashboard);
  }

  const structure = [
    {
      header: 'Branch Name',
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
      header: 'Expiry Day',
      Cell: ({ row }: any) => {
        const countDays = countDaysLeft(row?.original?.enrollSubscription?.validityTo);

        return row?.original?.disabledBySystem ? (
          <span className="font-semibold text-danger">Expired</span>
        ) : (
          <span className="font-semibold text-danger">{countDays < 0 ? 'Expired' : `${countDays} days left`}</span>
        );
      },
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
        const countDays = countDaysLeft(row?.original?.enrollSubscription?.validityTo);

        return row?.original?.disabledBySystem || countDays < 0 ? (
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
        const { source, enrollSubscription, disabledBySystem, _id, enrollSubscriptionId } = row?.original || {};
        const isAddonExpired = source === 'addon' && countDaysLeft(enrollSubscription?.validityTo) < 0;
        const isSystemDisabled = disabledBySystem;
        const totalBranch = session?.user?.totalBranch;
        const totalDisabledBySystem = data?.data.docs?.filter(
          (item: any) => item?.disabledBySystem === false && item?.source === 'subscription'
        )?.length;
        const totalAllowBranch = subscriptionList?.data?.find((item: Subscription) => item.slug === session?.user?.plan)?.allowTotalBranch;
        const remainingAllowBranch = totalAllowBranch - totalDisabledBySystem;

        if (isAddonExpired) {
          return (
            <Button
              onClick={() => {
                setRenewModalState(true);
                setRenewId(enrollSubscriptionId);
              }}
              preIcon={<MdAutorenew className="text-base" />}
              className="!m-0 !px-3 !py-2 !text-xs"
              color="danger"
              text="Renew Now"
            />
          );
        }

        if (isSystemDisabled) {
          return totalAllowBranch > totalDisabledBySystem ? (
            <Button
              preIcon={<IoPower className="text-base" />}
              onClick={() => {
                setActivateModalState(true);
                setActiveId(_id);
              }}
              className="!m-0 !px-3 !py-2 !text-xs"
              color="danger"
              text="Activate"
            />
          ) : session?.user?.plan === 'advanced' ? (
            // <span className="font-semibold text-danger">Purchase Add-On & Replace</span>
            <Button
              preIcon={<SiConvertio className="text-base" />}
              onClick={() => {
                setConvertModalState(true);
                setConvertId(_id);
              }}
              className="!m-0 !px-3 !py-2 !text-xs"
              color="danger"
              text="Convert To Add-On"
            />
          ) : (
            <span className="font-semibold text-danger">Upgrade Your Plan</span>
          );
        }

        return (
          <div className="flex items-center justify-center gap-2">
            <Link href={routes.privateRoutes.retailer.branch.edit(_id)}>
              <Button tooltip="Edit" color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
            </Link>
            <Button
              tooltip="Delete"
              color="danger"
              onClick={() => {
                setModalState(true);
                setDeleteId(_id);
              }}
              preIcon={<ImBin className="text-base" />}
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
        searchPlaceHolder="Search By Branch Name"
        enableRowNumbers={true}
      />

      <ActivateConfirmModal
        activateId={activeId}
        activateHandler={activateBranch}
        modalState={activateModalState}
        setModalState={setActivateModalState}
        isSubmitting={activeSubmitting}
        setIsSubmitting={setActiveSubmitting}
      />

      <ConvertToAddOnModal
        convertId={convertId}
        convertHandler={convertToAddOnBranch}
        modalState={convertModalState}
        setModalState={setConvertModalState}
        isSubmitting={convertSubmitting}
        setIsSubmitting={setConvertSubmitting}
      />

      <RenewConfirmModal
        renewId={renewId}
        renewHandler={renewBranch}
        modalState={renewModalState}
        setModalState={setRenewModalState}
        isSubmitting={renewSubmitting}
        setIsSubmitting={setRenewSubmitting}
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteBranch}
        modalState={modalState}
        setModalState={setModalState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
        isBranch={true}
      />
    </>
  );
}
