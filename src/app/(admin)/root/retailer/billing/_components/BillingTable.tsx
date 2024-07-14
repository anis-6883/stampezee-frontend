'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { useAllBillingQuery } from '@/features/retailer/billing/billingApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { Box } from '@mantine/core';
import _ from 'lodash';
import { useState } from 'react';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { Badge } from 'rizzui';

export default function BillingTable({ offset }: { offset: number }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllBillingQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    // {
    //   header: 'Retailer',
    //   accessorKey: 'retailer.storeName',
    //   Cell: ({ row }: any) => (
    //     <div className="flex flex-col justify-center gap-2">
    //       <div className="m-auto">
    //         {row.original.retailer.image ? (
    //           <div>
    //             <img
    //               src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.retailer.image}`}
    //               alt="image"
    //               className="h-full w-12 rounded"
    //             />
    //           </div>
    //         ) : (
    //           <img src={'/images/stamp-logo.png'} alt="image" className="h-full w-20 rounded" />
    //         )}
    //       </div>
    //       <div>
    //         <div className="text-md mx-auto">
    //           <p className="text-center font-semibold">
    //             {row?.original.retailer.storeName}
    //             {/* <span className="font-bold">Store Name:</span>  */}
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   ),
    //   mantineTableHeadCellProps: {
    //     align: 'center',
    //   },
    //   size: 150,
    // },
    {
      header: 'Plan',
      accessorKey: 'planSnapshot.title',
    },
    {
      header: 'Price(CAD)',
      accessorKey: 'price',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2 className="font-medium">${row?.original?.planSnapshot?.price}</h2>
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
      header: 'Payment Type',
      accessorKey: 'type',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.paymentStatus === 'pending' ? (
              <Badge className="!bg-warning">
                <GiSandsOfTime className="text-xl" /> {_.capitalize(row?.original?.paymentStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="text-xl" /> {_.capitalize(row?.original?.paymentStatus)}
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
    // {
    //   header: 'Discount',
    //   accessorKey: 'discountType',
    //   Cell: ({ row }: any) => (
    //     <div className="text-md mx-auto text-start">
    //       <p>
    //         <span className="font-bold">Type:</span> {row?.original.discountType}
    //       </p>
    //       <p>
    //         <span className="font-bold">Amount:</span> {row?.original.discount} {row?.original.discountType === 'flat' ? 'CAD' : '%'}
    //       </p>
    //     </div>
    //   ),
    // },
    // {
    //   header: 'Limit',
    //   accessorKey: 'limit',
    //   Cell: ({ row }: any) => (
    //     <div className="text-md mx-auto text-start">
    //       <p>
    //         <span className="font-bold">Limit:</span> {row?.original.limit}
    //       </p>
    //       <p>
    //         <span className="font-bold">Min. Purchased Amount:</span> {row?.original.minPurchaseAmount}
    //       </p>
    //     </div>
    //   ),
    //   //   size: 200,
    // },
    {
      header: 'Validity Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Started At:</span> {convertDateByOffset(row?.original?.validityFrom, offset)}
          </p>
          <p>
            <span className="font-bold">Expired At:</span> {convertDateByOffset(row?.original?.validityTo, offset)}
          </p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 250,
    },

    // {
    //   header: 'Actions',
    //   Cell: ({ row }: any) => (
    //     <div className="flex items-center justify-center gap-2">
    //       <Button
    //         color="warning"
    //         preIcon={<HiOutlinePencil className="text-base" />}
    //         onClick={() => {
    //           setFormData({
    //             ...row.original,
    //             image: row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : null,
    //             validDateRange: `${getFormattedDate(row?.original?.startedAt, offset)} to ${getFormattedDate(row?.original?.expiredAt, offset)}`,
    //           });
    //           setCreateState(true);
    //         }}
    //       />

    //       <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
    //     </div>
    //   ),
    //   mantineTableHeadCellProps: {
    //     align: 'center',
    //   },
    //   mantineTableBodyCellProps: {
    //     align: 'center',
    //   },
    // },
  ];

  const renderDetailPanel = ({ row }: any) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>Hello {row?.original?.planSnapshot?.price}</Box>
    </Box>
  );

  return (
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
      enableRowNumbers={true}
      renderDetailPanel={renderDetailPanel}
    />
  );
}
