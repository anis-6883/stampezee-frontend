'use client';

import { routes } from '@/config/routes';
import { useRetailerAllScanDetailsQuery } from '@/features/retailer/scan/scanApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsShop } from 'react-icons/bs';
import { LuUser } from 'react-icons/lu';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { Tab } from 'rizzui';
import Table from '../../../_components/Table';

export default function ScanTable({ offset }: { offset: number }) {
  const t = useTranslations('RetailerStampScanTable');
  const tScanTab = useTranslations('RetailerScanTab');
  const { data: session }: any = useSession();
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useRetailerAllScanDetailsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  useEffect(() => {
    if (!session?.user?.plan) {
      return redirect(routes.privateRoutes.retailer.dashboard);
    }
  }, [session]);

  const structure = [
    {
      header: t('stampTitle'),
      accessorKey: 'offer.title',
    },
    {
      header: t('scanDate'),
      Cell: ({ row }: any) => <div className="text-md mx-auto text-start">{convertDateByOffset(row?.original.scan.time, offset)}</div>,
    },
    {
      header: t('branch'),
      accessorKey: 'branch.name',
    },
    {
      header: t('customer'),
      accessorKey: 'customer.fullName',
    },
    {
      header: t('scannedBy'),
      accessorKey: 'subAdmin.fullName',
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
                <MdOutlineQrCodeScanner className="text-xl" /> <span className="font-semibold">{tScanTab('offerAndScan')}</span>
              </Tab.ListItem>
              <Tab.ListItem>
                <BsShop className="text-xl" /> <span className="font-semibold">{tScanTab('branch')}</span>
              </Tab.ListItem>
              <Tab.ListItem>
                <LuUser className="text-xl" /> <span className="font-semibold">{tScanTab('customer')}</span>
              </Tab.ListItem>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div>
                  <table className="w-full text-left text-sm text-gray-500">
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('scanTime')}</td>
                        <td className="px-6 py-4">{convertDateByOffset(row?.original?.scan?.time, offset)}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('stampTitle')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.title}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('stampCategory')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.category}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('noOfStampToCollect')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.noOfStampsToCollect}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('basicRules')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.rules}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('minPurchaseAmount')}</td>
                        <td className="px-6 py-4">{row?.original?.offer?.minPurchaseAmount} CAD</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('rewardType')}:</td>
                        <td className="px-6 py-4">{row?.original?.offer?.rewardType}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('reward')}:</td>
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
                        <td className="px-6 py-4">{tScanTab('branchName')}</td>
                        <td className="px-6 py-4">{row?.original?.branch?.name}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('branchAddress')}</td>
                        <td className="px-6 py-4">{row?.original?.branch?.address}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('subAdminName')}</td>
                        <td className="px-6 py-4">{row?.original?.subAdmin?.fullName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('subAdminEmail')}</td>
                        <td className="px-6 py-4">{row?.original?.subAdmin?.email}</td>
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
                        <td className="px-6 py-4">{tScanTab('name')}</td>
                        <td className="px-6 py-4">{row?.original?.customer?.fullName}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('email')}</td>
                        <td className="px-6 py-4">{row?.original?.customer?.email}</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('phone')}</td>
                        <td className="px-6 py-4">
                          {row?.original?.customer?.dialCode && row?.original?.customer?.phone
                            ? `${row?.original?.customer?.dialCode}${row?.original?.customer?.phone}`
                            : 'N/A'}
                        </td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{tScanTab('country')}</td>
                        <td className="px-6 py-4">{row?.original?.customer?.country ? row?.original?.customer?.country : 'N/A'}</td>
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
      searchFieldWidth="300px"
      renderDetailPanel={renderDetailPanel}
    />
  );
}
