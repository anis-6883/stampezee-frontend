import { useGetAllCustomerScanBySuperAdminQuery } from '@/features/super-admin/customer/customerApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { useState } from 'react';
import { BsShop } from 'react-icons/bs';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { Tab } from 'rizzui';
import Table from '../../../_components/Table';

const ScanStatisticsTable = ({ id, offset }: { id: string; offset: number }) => {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllCustomerScanBySuperAdminQuery({
    id,
    queries: {
      page: query.pageIndex + 1,
      limit: query.pageSize,
      ...searchQuery,
    },
  });

  const structure = [
    {
      header: 'Stamp Title',
      accessorKey: 'offer.title',
    },
    {
      header: 'Store',
      accessorKey: 'retailer.storeName',
    },
    {
      header: 'Branch',
      accessorKey: 'branch.name',
    },
    {
      header: 'Scanned By',
      accessorKey: 'subAdmin.fullName',
    },
    {
      header: 'Scan Date',
      Cell: ({ row }: any) => <div className="text-md mx-auto text-start">{convertDateByOffset(row?.original.scan.time, offset)}</div>,
    },
    {
      header: 'Status',
      Cell: ({ row }: any) => {
        const display = row?.original?.scan?.rewardCollected
          ? 'Reward Collected'
          : `${row?.original.scan.stampNumber} / ${row?.original?.offer?.noOfStampsToCollect}`;

        return <div>{display}</div>;
      },
    },
  ];

  const renderDetailPanel = ({ row }: any) => {
    return (
      <div className="mx-20 flex justify-start">
        <div className="w-1/2">
          <Tab>
            <Tab.List>
              <Tab.ListItem>
                <MdOutlineQrCodeScanner className="text-xl" /> <span className="font-semibold">Offer & Scan</span>
              </Tab.ListItem>
              <Tab.ListItem>
                <BsShop className="text-xl" /> <span className="font-semibold">Store</span>
              </Tab.ListItem>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div>
                  <table className="w-full text-left text-sm text-gray-500">
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Scan Time</td>
                        <td className="px-6 py-4">{convertDateByOffset(row?.original?.scan?.time, offset)}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Stamp Title</td>
                        <td className="px-6 py-4">{row?.original?.offer?.title}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Stamp Category</td>
                        <td className="px-6 py-4">{row?.original?.offer?.category}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">No of Stamp to Collect</td>
                        <td className="px-6 py-4">{row?.original?.offer?.noOfStampsToCollect}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Basic Rules</td>
                        <td className="px-6 py-4">{row?.original?.offer?.rules}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Min. Purchase Amount</td>
                        <td className="px-6 py-4">{row?.original?.offer?.minPurchaseAmount} CAD</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Reward Type</td>
                        <td className="px-6 py-4">{row?.original?.offer?.rewardType}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Reward</td>
                        <td className="px-6 py-4">
                          {row?.original?.offer?.rewardType === 'discount'
                            ? `${row?.original?.offer?.discountReward}%`
                            : row?.original?.offer?.promotionReward}
                        </td>
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
                        <td className="px-6 py-4">Store Name</td>
                        <td className="px-6 py-4">{row?.original?.retailer?.storeName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Owner Name</td>
                        <td className="px-6 py-4">{row?.original?.retailer?.fullName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Branch Name</td>
                        <td className="px-6 py-4">{row?.original?.branch?.name}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Branch Address</td>
                        <td className="px-6 py-4">{row?.original?.branch?.address}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Sub-Admin Name</td>
                        <td className="px-6 py-4">{row?.original?.subAdmin?.fullName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Sub-Admin Email</td>
                        <td className="px-6 py-4">{row?.original?.subAdmin?.email}</td>
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
        searchPlaceHolder="Search By Store Name"
        renderDetailPanel={renderDetailPanel}
      />
    </>
  );
};

export default ScanStatisticsTable;
