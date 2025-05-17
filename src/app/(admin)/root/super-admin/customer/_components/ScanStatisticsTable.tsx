import { RootState } from '@/features/store';
import { useGetAllCustomerScanBySuperAdminQuery } from '@/features/super-admin/customer/customerApi';
import { IQueryType } from '@/types';
import { capitalizeEachWord } from '@/utils/capitalizeEachWord';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useState } from 'react';
import { BsShop } from 'react-icons/bs';
import { CiReceipt } from 'react-icons/ci';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Tab } from 'rizzui';
import Table from '../../../_components/Table';

const ScanStatisticsTable = ({ id, timezone }: { id: string; timezone: string }) => {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllCustomerScanBySuperAdminQuery(
    {
      id,
      queries: {
        page: query.pageIndex + 1,
        limit: query.pageSize,
        ...searchQuery,
      },
    },
    { skip: !accessToken }
  );

  const structure = [
    {
      header: 'Stamp Card Title',
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
      header: 'Stamped By',
      accessorKey: 'subAdmin.fullName',
    },
    {
      header: 'Stamped Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">{getFormatDateByTimezone(row?.original.scan.time, timezone)}</div>
      ),
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
              <Tab.ListItem>
                <CiReceipt className="text-xl" /> <span className="font-semibold">Payment Receipt</span>
              </Tab.ListItem>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div>
                  <table className="w-full text-left text-sm text-gray-500">
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Stamp Time</td>
                        <td className="px-6 py-4">{getFormatDateByTimezone(row?.original?.scan?.time, timezone)}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Order amount</td>
                        <td className="px-6 py-4">{`${row?.original?.scan?.amount} ${row?.original?.scan?.amountCurrency}`}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Stamp Card Title</td>
                        <td className="px-6 py-4">{row?.original?.offer?.title}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Stamp Card Category</td>
                        <td className="px-6 py-4">{row?.original?.offer?.category}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">No. of stamps to collect</td>
                        <td className="px-6 py-4">{row?.original?.offer?.noOfStampsToCollect}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Basic rules</td>
                        <td className="px-6 py-4">{row?.original?.offer?.rules}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Min. purchase amount</td>
                        <td className="px-6 py-4">{row?.original?.offer?.minPurchaseAmount} CAD</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Reward type</td>
                        <td className="px-6 py-4">{capitalizeEachWord(row?.original?.offer?.rewardType)}</td>
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
                        <td className="px-6 py-4">Store name</td>
                        <td className="px-6 py-4">{row?.original?.retailer?.storeName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Owner name</td>
                        <td className="px-6 py-4">{row?.original?.retailer?.fullName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Branch name</td>
                        <td className="px-6 py-4">{row?.original?.branch?.name}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Branch address</td>
                        <td className="px-6 py-4">{row?.original?.branch?.address}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Loyalty-Executive name</td>
                        <td className="px-6 py-4">{row?.original?.subAdmin?.fullName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">Loyalty-Executive email</td>
                        <td className="px-6 py-4">{row?.original?.subAdmin?.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                {row?.original?.scan?.invoice ? (
                  <div className="flex items-center justify-center">
                    <img
                      width={400}
                      height={500}
                      src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row?.original?.scan?.invoice}`}
                      alt="invoice"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 items-center justify-center">
                    <span>No payment receipt upload yet!</span>
                  </div>
                )}
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
