'use client';

import Table from '@/app/(admin)/root/_components/Table';
import CustomDrawer from '@/components/CustomDrawer';
import Button from '@/components/Formik/Button';
import { useAllRefundBySuperAdminQuery, useConfirmRefundBySuperAdminMutation } from '@/features/super-admin/refund/refundApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaInfoCircle, FaRegPaperPlane } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoArrowDownCircle, IoCheckmarkCircle } from 'react-icons/io5';
import { MdCancel } from 'react-icons/md';
import { Badge } from 'rizzui';
import RefundConfirmModal from '../../../_components/RefundConfirmModal';
import RefundCalculateTable from './RefundCalculateTable';
import { RefundDetails } from './RefundDetails';

export default function RefundTable({ timezone }: { timezone: string }) {
  const [drawerState, setDrawerState] = useState<boolean>(false);
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [refundState, setRefundState] = useState(false);
  const [refundId, setRefundId] = useState(null);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllRefundBySuperAdminQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });
  const [confirmRefundBySuperAdmin, { isSuccess, isError }] = useConfirmRefundBySuperAdminMutation();

  useEffect(() => {
    if (isError) {
      setRefundSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setRefundState(false);
      setRefundId(null);
    }
    if (isSuccess) {
      setRefundSubmitting(false);
      toast.success('Refund completed successfully!');
      setRefundState(false);
      setRefundId(null);
    }
  }, [isSuccess, isError]);
  const structure = [
    {
      header: 'Retailer',
      accessorKey: 'enrollment.retailer',
      // Cell: ({ row }: any) => <div className="text-md mx-auto text-start capitalize">{row?.original?.plan}</div>,
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div>
            {row.original.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row?.original?.enrollment?.retailer?.image}`}
                  alt="image"
                  className="h-8 w-8 rounded"
                />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
            )}
          </div>
          <div>
            <div className="text-md">
              <p className="text-center font-semibold">{row?.original?.enrollment?.retailer?.storeName}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Issue Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{getFormatDateByTimezone(row?.original?.createdAt, timezone)}</p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 300,
    },
    {
      header: 'Refund Reason',
      accessorKey: 'reason',
      Cell: ({ row }: any) => (
        <Badge className="!bg-danger text-white">
          {row?.original?.reason === 'cancelled' ? (
            <>
              <MdCancel className="mr-1 text-xl" /> {_.capitalize(row?.original?.reason)}
            </>
          ) : (
            <>
              <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.reason)}
            </>
          )}
        </Badge>
      ),
    },
    {
      header: 'Refund Amount',
      accessorKey: 'refundAmount',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2 className="font-medium">
              {row?.original?.refundAmount?.toFixed(2)} {row?.original?.currency}
            </h2>
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
      header: 'Refund Status',
      accessorKey: 'refundStatus',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.refundStatus === 'pending' ? (
              <Badge className="!bg-warning">
                <GiSandsOfTime className="text-xl" /> {_.capitalize(row?.original?.refundStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="text-xl" /> {_.capitalize(row?.original?.refundStatus)}
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
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => {
              setSelectedRefundId(row.original?._id);
              setDrawerState(true);
            }}
            className="!mb-2 !text-xs"
            color="primary"
            preIcon={<FaInfoCircle className="text-base" />}
            tooltip="Details"
          />
          {row?.original?.refundStatus === 'completed' ? (
            <span className="font-semibold text-danger">Refunded!</span>
          ) : (
            <Button
              className="!px-3 !py-2 !text-xs"
              onClick={() => handleRefund(row.original)}
              color="danger"
              text="Refund"
              preIcon={<FaRegPaperPlane className="text-base" />}
            />
          )}
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

  const handleRefund = (rowData: any) => {
    setRefundState(true);
    setRefundId(rowData._id);
  };

  const RenderDetailPanel = ({ row }: any) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const retailerEmail = row?.original?.enrollment?.retailer?.email?.split(/[-\s]/)?.find((part: string) => emailRegex.test(part));
    return (
      <div className="">
        <div className="flex ">
          <div className="flex w-28 flex-col justify-center gap-2 border-r-2">
            <div className="mx-auto">
              {row.original?.enrollment?.retailer?.image ? (
                <div>
                  <img
                    src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original?.enrollment?.retailer?.image}`}
                    alt="image"
                    className="h-full w-12 rounded"
                  />
                </div>
              ) : (
                <img src={'/images/stamp-logo.png'} alt="image" className="h-full w-12 rounded" />
              )}
            </div>
            <div>
              <div className="text-md">
                <p className="text-center font-semibold">{row?.original?.enrollment?.retailer?.storeName}</p>
              </div>
            </div>
          </div>
          <div className="text-md ml-3 text-start">
            <p>
              <span className="font-bold">Full name:</span> {row?.original?.enrollment?.retailer?.fullName}
            </p>
            <p>
              <span className="font-bold">Email:</span> {retailerEmail}
            </p>
            <p>
              <span className="font-bold">Phone:</span>{' '}
              {row?.original?.enrollment?.retailer?.phone && row?.original?.enrollment?.retailer?.dialCode
                ? `${row?.original?.enrollment?.retailer?.dialCode}${row?.original?.enrollment?.retailer?.phone}`
                : 'N/A'}
            </p>
            <p>
              <span className="font-bold">Country:</span>{' '}
              {row?.original?.enrollment?.retailer?.country ? row?.original?.enrollment?.retailer?.country : 'N/A'}
            </p>
          </div>
        </div>

        <RefundCalculateTable data={row?.original} timezone={timezone} />
      </div>
    );
  };

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
        searchPlaceHolder="Search By Payment ID"
        searchFieldWidth="250px"
        // renderDetailPanel={RenderDetailPanel}
      />

      <RefundConfirmModal
        refundId={refundId}
        refundHandler={confirmRefundBySuperAdmin}
        modalState={refundState}
        setModalState={setRefundState}
        isSubmitting={refundSubmitting}
        setIsSubmitting={setRefundSubmitting}
      />

      {/* Custom drawer  */}
      <CustomDrawer
        className=" bg-[#F2F2F2] px-3"
        drawerState={drawerState}
        handleCloseDrawer={() => {
          setSelectedRefundId(null);
          setDrawerState(false);
        }}
        title={'Refund Details'}
        customSize={700}
      >
        <RefundDetails id={selectedRefundId} timezone={timezone} />
      </CustomDrawer>
    </>
  );
}
