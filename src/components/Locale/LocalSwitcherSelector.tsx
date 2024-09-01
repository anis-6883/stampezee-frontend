import { Currency, Locale } from '@/config';
import { getUserCurrency, setUserCurrency } from '@/services/currency';
import { getUserLocale, setUserLocale } from '@/services/locale';
import currencyData from '@/utils/get-currency-list';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { BsTranslate } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { RiCurrencyFill } from 'react-icons/ri';
import { ActionIcon, AdvancedRadio, Modal, Tab, Text } from 'rizzui';

const languageOptions = [
  { label: 'English', value: 'en', country: 'United State' },
  { label: 'Arabic', value: 'ar', country: 'Saudi Arabia' },
];

export default function LocalSwitcherSelector({
  modalState,
  setModalState,
  currencyExchanges,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  currencyExchanges: any;
}) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const t1 = useTranslations('LocaleSwitcher');
  const t2 = useTranslations('CurrencySwitcher');

  const currencyExchangeOptions = currencyData?.reduce((acc: any, curr: any) => {
    currencyExchanges?.map((item: any) => {
      if (item?.name === curr?.code) {
        acc?.push(curr);
      }
    });
    return acc;
  }, []);

  useEffect(() => {
    (async () => {
      const locale = await getUserLocale();
      const currency = await getUserCurrency();
      setSelectedOption(locale);
      setSelectedCurrency(currency);
    })();
  }, []);

  const [isPending, startTransition] = useTransition();

  // handle language
  const handleLanguageChange = (locale: Locale) => {
    setSelectedOption(locale);

    startTransition(() => {
      setUserLocale(locale);
    });
  };
  // handle currency
  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);

    startTransition(() => {
      setUserCurrency(currency);
    });
    setModalState(false);
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)} customSize="630px">
      <div className="m-auto px-7 pb-3 pt-5">
        <div className="flex items-center justify-end">
          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
            }}
          >
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>

        <Tab>
          <Tab.List>
            <Tab.ListItem className="text-black hover:text-black">
              <BsTranslate className="mr-1 text-lg" /> <span className="font-semibold">{t1('label')}</span>
            </Tab.ListItem>
            <Tab.ListItem className="text-black hover:text-black">
              <RiCurrencyFill className="mr-1 text-lg" />
              <span className="font-semibold">{t2('label')}</span>
            </Tab.ListItem>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="my-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {languageOptions?.map((lang: any) => (
                    <AdvancedRadio
                      // disabled={checkDisableBranch(item)}
                      key={lang.value}
                      onClick={() => handleLanguageChange(lang?.value)}
                      name="language"
                      value={lang.value}
                      contentClassName={`rounded-lg border hover:border-danger ${selectedOption === lang?.value ? '!border-danger ring-1 !ring-danger' : '!ring-0'}`}
                      inputClassName="[&:checked~span_.icon]:block"
                    >
                      <span className="flex flex-col">
                        <Text as="b">{lang?.label}</Text>
                        <span>{lang?.country}</span>
                      </span>
                    </AdvancedRadio>
                  ))}
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="my-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currencyExchangeOptions?.map((currency: any) => (
                    <AdvancedRadio
                      // disabled={checkDisableBranch(item)}
                      key={currency.id}
                      onClick={() => handleCurrencyChange(currency?.code)}
                      name="currency"
                      value={currency?.code}
                      contentClassName={`rounded-lg border hover:border-danger ${selectedCurrency === currency?.code ? '!border-danger ring-1 !ring-danger' : '!ring-0'}`}
                      inputClassName="[&:checked~span_.icon]:block"
                    >
                      <span className="flex flex-col">
                        <Text as="b">{currency?.localized_full_name}</Text>
                        <span>
                          {currency?.code} - {currency?.unicode_symbol}
                        </span>
                        {/* <LuCheckCircle className="icon hidden h-5 w-5 text-danger" /> */}
                      </span>
                    </AdvancedRadio>
                  ))}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab>
      </div>
    </Modal>
  );
}
