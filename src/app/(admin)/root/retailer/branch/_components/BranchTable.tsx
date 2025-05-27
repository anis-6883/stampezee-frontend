'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/StatusIndicator';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import {
  useActivateBranchMutation,
  useAllBranchQuery,
  useConvertToAddOnBranchMutation,
  useDeleteBranchMutation,
  useUpdateBranchStatusMutation,
} from '@/features/retailer/branch/branchApi';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { IQueryType, Subscription } from '@/types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { IoPower } from 'react-icons/io5';
import { LuCopy } from 'react-icons/lu';
import { SiConvertio } from 'react-icons/si';
import { Badge, Switch } from 'rizzui';
import ActivateConfirmModal from '../../../_components/ActivateConfirmModal';
import ConvertToAddOnModal from '../../../_components/ConvertToAddOnModal';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';

export default function BranchTable() {
  const { data: session }: any = useSession();
  const t = useTranslations('RetailerBranchTable');
  const t2 = useTranslations('RetailerBranches');
  const t3 = useTranslations('RetailerStampTable');
  const [deleteBranch, { isSuccess, isError }] = useDeleteBranchMutation();
  const [updateStatus] = useUpdateBranchStatusMutation();
  const [activateBranch, { isSuccess: activateBranchSuccess, isError: activateBranchError }] = useActivateBranchMutation();
  const [convertToAddOnBranch, { isSuccess: convertToAddonBranchSuccess, isError: convertToAddonBranchError, error: convertAddOnError }] =
    useConvertToAddOnBranchMutation();
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
      toast.error(t('errorMessage'));
      setModalState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success(t('branchDeleted'));
      setModalState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError, t]);

  // Handle Active Branch Response
  useEffect(() => {
    if (activateBranchError) {
      setActiveSubmitting(false);
      toast.error(t('errorMessage'));
      setActivateModalState(false);
      setActiveId(null);
    }
    if (activateBranchSuccess) {
      setActiveSubmitting(false);
      toast.success(t('branchActivated'));
      setActivateModalState(false);
      setActiveId(null);
    }
  }, [activateBranchSuccess, activateBranchError, t]);

  // Handle Convert To Add-on Branch Response
  useEffect(() => {
    const myError = convertAddOnError as SerializedError;
    if (convertToAddonBranchError) {
      setConvertSubmitting(false);
      toast.error(myError?.data?.message || t('errorMessage'));
      setConvertModalState(false);
      setConvertId(null);
    }
    if (convertToAddonBranchSuccess) {
      setConvertSubmitting(false);
      toast.success(t('branchConverted'));
      setConvertModalState(false);
      setConvertId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertToAddonBranchSuccess, convertToAddonBranchError, convertAddOnError]);

  useEffect(() => {
    if (session?.user?.totalBranch === 0 || !session?.user?.plan) {
      return redirect(routes.privateRoutes.retailer.dashboard);
    }
  }, [session]);

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
      header: t('branchName'),
      accessorKey: 'name',
    },
    {
      header: t('address'),
      accessorKey: 'address',
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.address.name.length > 60 ? `${row?.original?.address.name.substring(0, 60)}...` : row?.original?.address.name}
        </div>
      ),
    },
    {
      header: t('source'),
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
      header: t('expiryDay'),
      Cell: ({ row }: any) => {
        const countDays = row?.original?.enrollSubscription?.planDaysLeft;

        return row?.original?.disabledBySystem ? (
          <span className="font-semibold text-danger">{'Disabled'}</span>
        ) : session?.user?.plan === 'trial' && row?.original?.enrollSubscription?.unlimitedFieldName ? (
          <span className="font-semibold text-danger">{session?.user?.unlimitedFieldName}</span>
        ) : (
          <span className="font-semibold text-danger">{countDays < 0 ? t('expired') : `${countDays} ${t('daysLeft')}`}</span>
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
      header: t3('status'),
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        const countDays = row?.original?.enrollSubscription?.planDaysLeft;

        return row?.original?.disabledBySystem || countDays < 0 ? (
          <Switch
            checked={false}
            disabled={true}
            switchClassName="bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-red-500/50 hover:bg-gradient-to-br focus:ring-red-300"
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
      header: t('actions'),
      Cell: ({ row }: any) => {
        const { disabledBySystem, _id } = row?.original || {};
        const isSystemDisabled = disabledBySystem;
        const totalDisabledBySystem = data?.data.docs?.filter(
          (item: any) => item?.disabledBySystem === false && item?.source === 'subscription'
        )?.length;
        const totalAllowBranch = subscriptionList?.data?.find((item: Subscription) => item.slug === session?.user?.plan)?.allowTotalBranch;

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
              tooltip={t('activate')}
              // text={t('activate')}
            />
          ) : session?.user?.plan === 'advanced' ? (
            <Button
              preIcon={<SiConvertio className="text-base" />}
              onClick={() => {
                setConvertModalState(true);
                setConvertId(_id);
              }}
              className="!m-0 !px-3 !py-2 !text-xs"
              color="danger"
              tooltip={t('convertToAddOn')}
              // text={t('convertToAddOn')}
            />
          ) : (
            <span className="font-semibold text-danger">{t('upgradeYourPlan')}</span>
          );
        }

        return (
          <div className="flex items-center justify-center gap-2">
            <Link href={routes.privateRoutes.retailer.branch.edit(_id)}>
              <Button tooltip="Edit" color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
            </Link>
            {/* <Button
              tooltip="Delete"
              color="danger"
              onClick={() => {
                setModalState(true);
                setDeleteId(_id);
              }}
              preIcon={<ImBin className="text-base" />}
            /> */}
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

  const totalAllowBranch = session?.user?.totalBranch;
  const totalDisabledBySystem = data?.data?.docs?.filter((item: any) => item?.disabledBySystem && item?.source === 'subscription')?.length;
  const totalCreatedBranch = data?.data.totalDocs - totalDisabledBySystem;

  return (
    <>
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:flex-row md:gap-0">
        <StatusIndicator />
        <Link href={routes.privateRoutes.retailer.branch.create}>
          <Button
            disabled={totalCreatedBranch < totalAllowBranch ? false : true}
            className="!m-0 w-full"
            color="danger"
            text={t2('addNewBranch')}
            preIcon={<HiPlus className="text-base" />}
          />
        </Link>
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
        searchPlaceHolder={t('placeHolder')}
        enableRowNumbers={false}
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
