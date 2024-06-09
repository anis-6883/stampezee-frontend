'use client';

import Table from '@/app/(admin)/root/_components/Table';

import {
  useDeleteSuperAdminStampImageMutation,
  useUpdateSuperAdminStampImageMutation,
} from '@/features/super-admin/stamp-image/stampImageApi';
import { IQueryType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import Button from '../../../_components/Button';

import { useGetAllRetailersQuery } from '@/features/super-admin/retailer/retailerApi';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';

export default function RetailerTable() {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllRetailersQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteSuperAdminStampImage, { isSuccess, isError }] = useDeleteSuperAdminStampImageMutation();
  const [updateStatus] = useUpdateSuperAdminStampImageMutation();

  const handleDelete = async (rowData: any) => {
    setDeleteState(true);
    setDeleteId(rowData._id);
  };

  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setDeleteState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success('Stamps Image deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Info',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div>
          <div>
            {row.original.image ? (
              <div>
                <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}`} alt="image" className="w-14 rounded" />
              </div>
            ) : (
              <img src={'/profile.png'} alt="image" className="w-14 rounded" />
            )}
          </div>
          <div></div>
        </div>
      ),
    },
    {
      header: 'Address',
      // Cell: ({ row }: any) => (
      //   <div className="flex items-center justify-center gap-2">
      //     <Button
      //       color="warning"
      //       preIcon={<HiOutlinePencil className="text-base" />}
      //       onClick={() => {
      //         setFormData({
      //           ...row.original,
      //           image: row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : null,
      //         });
      //         setCreateState(true);
      //       }}
      //     />

      //     <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
      //   </div>
      // ),
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
      Cell: ({ row }: any) => <SwitchButton updateStatus={updateStatus} id={row?.original?._id} status={row?.original?.status} />,
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: 'Actions',
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

          <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
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
      <CreateUpdateModel setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />
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
        searchPlaceHolder="Search By Title"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteSuperAdminStampImage}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
