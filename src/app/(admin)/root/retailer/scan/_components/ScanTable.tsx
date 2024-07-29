'use client';

import { useGetAllCustomerQuery } from '@/features/retailer/customer/customerApi';
import { useDeleteSubAdminMutation } from '@/features/retailer/sub-admin/subAdminApi';
import { IQueryType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsShop } from 'react-icons/bs';
import { LuUser } from 'react-icons/lu';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { Tab } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import Table from '../../../_components/Table';

export default function ScanTable() {
  const [deleteSubAdmin, { isSuccess, isError }] = useDeleteSubAdminMutation();
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Query State
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllCustomerQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  // Handle Delete Response
  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setDeleteState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success('Sub Admin deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Stamp Title',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div className="flex gap-2">
          <div>
            <div className="text-md mx-auto text-start">
              <p>
                <span className="font-bold">Name:</span> {row?.original.customer.fullName}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Scan Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{row?.original.customer.country}</p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: 'Branch',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{row?.original.customer.country}</p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: 'Scanned By',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{row?.original.customer.country}</p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: 'Status',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{row?.original.customer.country}</p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
  ];

  const renderDetailPanel = ({ row }: any) => {
    const total = row?.original?.amountTotal || 0;

    return (
      <div className=" mx-20 flex justify-start">
        <div className="">
          <Tab>
            <Tab.List>
              <Tab.ListItem>
                <MdOutlineQrCodeScanner className="text-xl" /> <span className="font-semibold">Offer & Scan</span>
              </Tab.ListItem>
              <Tab.ListItem>
                <BsShop className="text-xl" /> <span className="font-semibold">Branch</span>
              </Tab.ListItem>
              <Tab.ListItem>
                <LuUser className="text-xl" /> <span className="font-semibold">Customer</span>
              </Tab.ListItem>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div>
                  <table className="w-full text-left text-sm text-gray-500">
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Scan Time</td>
                        <td className="px-6 py-4">$2999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Stamp Title</td>
                        <td className="px-6 py-4">$2999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Stamp Category</td>
                        <td className="px-6 py-4">$1999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">No of Stamp to Collect</td>
                        <td className="px-6 py-4">$99</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Basic Rules</td>
                        <td className="px-6 py-4">$99</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Min. Purchase Amount:</td>
                        <td className="px-6 py-4">$99</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Reward Type:</td>
                        <td className="px-6 py-4">$99</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Reward:</td>
                        <td className="px-6 py-4">$99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div>
                  <table className="w-full text-left text-sm text-gray-500">
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Branch Name</td>
                        <td className="px-6 py-4">$2999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Branch Address</td>
                        <td className="px-6 py-4">$2999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Sub-Admin Name</td>
                        <td className="px-6 py-4">$1999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Sub-Admin Email</td>
                        <td className="px-6 py-4">$99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div>
                  <table className="w-full text-left text-sm text-gray-500">
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Name</td>
                        <td className="px-6 py-4">$2999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Email</td>
                        <td className="px-6 py-4">$2999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Phone</td>
                        <td className="px-6 py-4">$1999</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Country</td>
                        <td className="px-6 py-4">$99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab>
        </div>
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
        searchPlaceHolder="Search By Customer Name & Email"
        searchFieldWidth="300px"
        renderDetailPanel={renderDetailPanel}
      />

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
