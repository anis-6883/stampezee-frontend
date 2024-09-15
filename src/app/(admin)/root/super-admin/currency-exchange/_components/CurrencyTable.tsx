'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/shared/StatusIndicator';
import {
  useDeleteCurrencyMutation,
  useGetAllCurrencyQuery,
  useUpdateCurrencyStatusMutation,
} from '@/features/super-admin/currency/currencyApi';
import { IQueryType } from '@/types';
import getFormattedDate from '@/utils/get-formatted-date';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import { Badge } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';
import CurrencyModal from './CurrencyModal';

export default function CurrencyTable({ offset }: { offset: number }) {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [currencyModalState, setCurrencyModalState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllCurrencyQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteCurrency, { isSuccess, isError }] = useDeleteCurrencyMutation();
  const [updateCurrencyStatus] = useUpdateCurrencyStatusMutation();

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
      toast.success('Currency deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Exchange Rate',
      accessorKey: 'exchangeRate',
      Cell: ({ row }: any) => {
        return <span className="font-normal">{row?.original?.exchangeRate}</span>;
      },
    },

    {
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        return <SwitchButton updateStatus={updateCurrencyStatus} id={row?.original?._id} status={row?.original?.status} />;
      },
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
                validDateRange: `${getFormattedDate(row?.original?.startedAt, offset)} to ${getFormattedDate(row?.original?.expiredAt, offset)}`,
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
      <CurrencyModal
        modalState={currencyModalState}
        setModalState={setCurrencyModalState}
        currencyData={data?.data?.docs?.map((item: any) => item?.name)}
      />
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:flex-row md:gap-0">
        <div className="flex flex-col gap-x-3 gap-y-3 md:flex-row md:gap-y-0">
          <StatusIndicator />
          <div className="flex items-center justify-center rounded-md border border-solid p-3">
            <span className="font-bold">
              Base Currency :
              <Badge size="sm" className="ml-1 bg-danger text-white">
                CAD
              </Badge>
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <Button color="danger" onClick={() => setCreateState(true)} text="New Currency" preIcon={<HiPlus className="text-base" />} />
          <Button
            color="danger"
            onClick={() => setCurrencyModalState(true)}
            text="Currency From Api"
            preIcon={<HiPlus className="text-base" />}
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
        searchPlaceHolder="Search By Currency Name"
        searchFieldWidth="250px"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteCurrency}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
