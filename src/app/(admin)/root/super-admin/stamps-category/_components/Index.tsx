'use client';

import AskConfirmation from '@/app/(admin)/root/_components/AskConfirmation';
import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/shared/Button/Button';
import {
  useDeleteSuperAdminStampImageCategoryMutation,
  useGetAllSuperAdminStampImagesCategoryQuery,
} from '@/features/super-admin/stamp-category/stampCategoryApi';
import { IQueryType } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import CreateModel from './CreateModel';
let popup = false;

export default function Index() {
  const router = useRouter();

  const [modalState, setModalState] = useState(false);
  const [edit, setEdit] = useState(false);
  const [updateValue, setUpdateValue] = useState({});

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSuperAdminStampImagesCategoryQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteSuperAdminStampImage] = useDeleteSuperAdminStampImageCategoryMutation();

  const structure = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    // {
    //   header: 'Description',
    //   Cell: ({ row }: any) => <div>{row.original.description}</div>,
    // },
    {
      header: 'Image',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div>
          <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}`} alt="image" className="h-10 w-10 rounded-full" />
        </div>
      ),
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row.original)}>
            <HiOutlinePencil className="text-base" />
          </button>
          <button onClick={() => handleDelete(row.original)}>
            <ImBin className="text-base" />
          </button>
        </div>
      ),
    },
  ];
  const handleEdit = (rowData: any) => {
    setEdit(true);

    const newData = {
      id: rowData._id,
      status: rowData.status,
      name: rowData.name,
      description: rowData.description,
      image: `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${rowData.image}`,
    };

    setUpdateValue(newData);
    setModalState(true);
  };

  const handleDelete = async (rowData: any) => {
    if (popup) return;
    toast((t) => {
      popup = t.visible;
      return AskConfirmation(t, () => deleteSuperAdminStampImage({ id: rowData._id }));
    });
  };

  const handleClose = () => {
    setModalState(!modalState);
    setEdit(!edit);
    setUpdateValue({});
  };

  return (
    <>
      <CreateModel
        setModalState={handleClose}
        modalState={modalState}
        edit={edit}
        setEdit={setEdit}
        updateValue={updateValue}
        setUpdateValue={setUpdateValue}
        handleClose={handleClose}
      />
      <div className="mb-4 flex justify-end">
        <Button text="Add new Stamp" onClick={() => handleClose()} />
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
        enableDnD={false}
        // sort={sort}
        sortContext="branchTable"
        enableRowActions={false}
      />
    </>
  );
}
