'use client';

import Button from '@/components/Formik/Button';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateCurrencyMutation, useGetAllCurrencyFromApiQuery } from '@/features/super-admin/currency/currencyApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi2';
import { IoCloseOutline } from 'react-icons/io5';
import { LuPlus } from 'react-icons/lu';
import { ActionIcon, Modal, Title } from 'rizzui';

export default function CurrencyModal({
  currencyData,
  modalState,
  setModalState,
}: {
  currencyData: any;
  modalState: boolean;
  setModalState: (state: boolean) => void;
}) {
  const [searchText, setSearchText] = useState<string>('');
  const { data } = useGetAllCurrencyFromApiQuery({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<any>({});
  const [createCurrency, { isSuccess: createSuccess, error: createError }] = useCreateCurrencyMutation();

  let currencies = data?.rates;

  if (searchText?.length > 0) {
    const lowerQuery = searchText.toLowerCase();
    currencies = currencies.filter(
      (item: any) => item.name.toLowerCase().includes(lowerQuery) || item.currency.toLowerCase().includes(lowerQuery)
    );
  }

  // Create Response Handler
  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (createSuccess) {
      toast.success('Currency created successfully!');
      setIsSubmitting(false);
    }
  }, [createError, createSuccess, setModalState]);

  return (
    <div>
      <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="700px">
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <Title as="h4">Add New Currency Exchange Rate</Title>

            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => {
                setModalState(false);
              }}
            >
              <IoCloseOutline className="text-2xl text-danger" />
            </ActionIcon>
          </div>

          <div className="relative h-[400px] overflow-auto sm:rounded-lg">
            <div className="bg-white pb-4 dark:bg-gray-900">
              <label className="sr-only">Search</label>
              <div className="relative mt-10">
                <div className="rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                  <svg
                    className="fixed top-[86px] z-50 h-4 w-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  value={searchText}
                  onChange={(e: any) => setSearchText(e.target.value)}
                  className="fixed top-[76px] block w-80 rounded-lg border border-gray-300 bg-gray-50 ps-10 pt-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Search by Name"
                />
              </div>
            </div>

            {/* Add scrollable container */}
            <div className="relative h-[300px] overflow-y-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="sticky top-0 bg-gray-50">
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Currency
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Exchange Rate
                    </th>
                    <th scope="col" className="flex justify-center px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                {currencies?.length !== 0 ? (
                  <tbody>
                    {currencies?.map((currency: any) => (
                      <tr
                        key={currency?.currency}
                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                      >
                        <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {`${currency?.name} - ${currency?.currencyIcon}`}
                        </th>
                        <td className="px-6 py-4">{currency?.currency}</td>
                        <td className="px-6 py-4">{currency?.exchangeRate}</td>
                        <td className="flex justify-center px-6 py-4">
                          {!currencyData?.includes(currency?.currency) ? (
                            <Button
                              color="danger"
                              type="submit"
                              text={'Add'}
                              onClick={() => {
                                setIsSubmitting(true);
                                setSelectedCurrency({
                                  name: currency?.name,
                                  currency: currency?.currency,
                                  exchangeRate: currency?.exchangeRate,
                                  currencyIcon: currency?.currencyIcon,
                                });
                                createCurrency({
                                  name: currency?.name,
                                  currency: currency?.currency,
                                  exchangeRate: currency?.exchangeRate,
                                  currencyIcon: currency?.currencyIcon,
                                });
                              }}
                              preIcon={<LuPlus className="text-base" />}
                              isSubmitting={isSubmitting && selectedCurrency?.name === currency}
                              className="!m-0 !px-2 !py-1.5"
                            />
                          ) : (
                            <Button
                              color="warning"
                              type="submit"
                              text={'Update'}
                              onClick={() => {
                                setIsSubmitting(true);
                                setSelectedCurrency({
                                  name: currency?.name,
                                  currency: currency?.currency,
                                  exchangeRate: currency?.exchangeRate,
                                  currencyIcon: currency?.currencyIcon,
                                });
                                createCurrency({
                                  name: currency?.name,
                                  currency: currency?.currency,
                                  exchangeRate: currency?.exchangeRate,
                                  currencyIcon: currency?.currencyIcon,
                                });
                              }}
                              preIcon={<HiOutlinePencil className="text-base" />}
                              isSubmitting={isSubmitting && selectedCurrency?.name === currency}
                              className="!m-0 !px-2 !py-1.5"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                        <div className="flex h-full items-center justify-center">No Result Found!</div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
