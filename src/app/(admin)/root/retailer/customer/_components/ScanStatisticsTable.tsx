import { useGetAllCustomerScanByRetailerQuery } from '@/features/retailer/customer/customerApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BsShop } from 'react-icons/bs';
import { CiReceipt } from 'react-icons/ci';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { Tab } from 'rizzui';
import Table from '../../../_components/Table';

const ScanStatisticsTable = ({ id, offset }: { id: string; offset: number }) => {
  const t = useTranslations('RetailerCustomerDetailsScanTable');
  const t2 = useTranslations('RetailerCustomerDetailsScanTableTabs');
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllCustomerScanByRetailerQuery({
    id,
    queries: {
      page: query.pageIndex + 1,
      limit: query.pageSize,
      ...searchQuery,
    },
  });

  const structure = [
    {
      header: t('stampTitle'),
      accessorKey: 'offer.title',
    },
    {
      header: t('store'),
      accessorKey: 'retailer.storeName',
    },
    {
      header: t('branch'),
      accessorKey: 'branch.name',
    },
    {
      header: t('scannedBy'),
      accessorKey: 'subAdmin.fullName',
    },
    {
      header: t('scanDate'),
      Cell: ({ row }: any) => <div className="text-md mx-auto text-start">{convertDateByOffset(row?.original.scan.time, offset)}</div>,
    },
    {
      header: t('status'),
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
                <MdOutlineQrCodeScanner className="text-xl" /> <span className="font-semibold">{t2('offerAndScan')}</span>
              </Tab.ListItem>
              <Tab.ListItem>
                <BsShop className="text-xl" /> <span className="font-semibold">{t2('store')}</span>
              </Tab.ListItem>
              <Tab.ListItem>
                <CiReceipt className="text-xl" /> <span className="font-semibold">{t2('paymentReceipt')}</span>
              </Tab.ListItem>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div>
                  <table className="w-full text-left text-sm text-gray-500">
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('scanTime')}</td>
                        <td className="px-6 py-4">{convertDateByOffset(row?.original?.scan?.time, offset)}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('stampTitle')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.title}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('stampCategory')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.category}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('noOfStampToCollect')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.noOfStampsToCollect}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('basicRules')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.rules}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('minPurchaseAmount')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.minPurchaseAmount} CAD</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('rewardType')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.rewardType}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('reward')}</td>
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
                        <td className="px-6 py-4">{t2('storeName')}</td>
                        <td className="px-6 py-4">{row?.original?.retailer?.storeName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('branchName')}</td>
                        <td className="px-6 py-4">{row?.original?.branch?.name}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('branchAddress')}</td>
                        <td className="px-6 py-4">{row?.original?.branch?.address}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('subAdminName')}</td>
                        <td className="px-6 py-4">{row?.original?.subAdmin?.fullName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{t2('subAdminEmail')}</td>
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
        searchPlaceHolder={t('placeHolder')}
        renderDetailPanel={renderDetailPanel}
      />
    </>
  );
};

export default ScanStatisticsTable;
