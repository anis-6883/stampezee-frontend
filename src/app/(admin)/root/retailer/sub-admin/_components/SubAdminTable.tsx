'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/StatusIndicator';
import { routes } from '@/config/routes';
import {
  useDeleteSubAdminMutation,
  useGetAllSubAdminsQuery,
  useUpdateSubAdminStatusMutation,
} from '@/features/retailer/sub-admin/subAdminApi';
import { IQueryType } from '@/types';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModal from './CreateUpdateModal';

export default function SubAdminTable() {
  const t = useTranslations('RetailerSubAdminTable');
  const t2 = useTranslations('RetailerSubAdmin');
  const tCommon = useTranslations('RetailerCommon');
  const { data: session }: any = useSession();
  const [formData, setFormData] = useState({});
  const [deleteSubAdmin, { isSuccess, isError }] = useDeleteSubAdminMutation();
  const [createState, setCreateState] = useState(false);
  const [updateStatus] = useUpdateSubAdminStatusMutation();

  // Deletion State
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Query State
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSubAdminsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  // Handle Delete Response
  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error(tCommon('errorMessage'));
      setDeleteState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success(t('subAdminDeletedSuccessfully'));
      setDeleteState(false);
      setDeleteId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  useEffect(() => {
    if (!session?.user?.plan) {
      return redirect(routes.privateRoutes.retailer.dashboard);
    }
  }, [session]);

  const handleSubAdminCreate = async () => {
    setCreateState(true);
  };

  const structure = [
    {
      header: t('image'),
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div>
          {row.original.image ? (
            <div>
              <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}`} alt="image" className="w-12 rounded" />
            </div>
          ) : (
            <img src={'/images/profile.png'} alt="image" className="w-12 rounded" />
          )}
        </div>
      ),
    },
    {
      header: t('firstName'),
      accessorKey: 'firstName',
    },
    {
      header: t('lastName'),
      accessorKey: 'lastName',
      Cell: ({ row }: any) => <span>{row?.original?.lastName ?? 'N/A'}</span>,
    },
    {
      header: t('email'),
      accessorKey: 'email',
    },
    {
      header: t('branch'),
      accessorKey: 'branch.name',
    },
    {
      header: t('status'),
      accessorKey: 'status',
      Cell: ({ row }: any) => <SwitchButton updateStatus={updateStatus} id={row?.original?._id} status={row?.original?.status} />,
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: t('actions'),
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            color="warning"
            preIcon={<HiOutlinePencil className="text-base" />}
            onClick={() => {
              setFormData({
                ...row.original,
                image: row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : null,
              });
              setCreateState(true);
            }}
          />

          <Button
            color="danger"
            preIcon={
              <ImBin
                className="text-base"
                onClick={() => {
                  setDeleteState(true);
                  setDeleteId(row.original._id);
                }}
              />
            }
          />
        </div>
      ),
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
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:flex-row md:gap-0">
        <StatusIndicator />
        <div>
          <Button
            className="w-full"
            color="danger"
            text={t2('addNewSubAdmin')}
            preIcon={<HiPlus className="text-base" />}
            onClick={handleSubAdminCreate}
          />
        </div>
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
      />

      <CreateUpdateModal setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteSubAdmin}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
