import { Currency, Locale } from '@/config';
import { setCurrentCurrency } from '@/features/currency-exchange/currencyExchangeSlice';
import { resetState, setCurrency } from '@/features/subscription/subscriptionSlice';
import { getUserCurrency, setUserCurrency } from '@/services/currency';
import { getUserLocale, setUserLocale } from '@/services/locale';
import currencyData from '@/utils/get-currency-list';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { BsTranslate } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { RiCurrencyFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { ActionIcon, AdvancedRadio, Modal, Tab, Text } from 'rizzui';

const languageOptions = [
  { label: 'English', value: 'en', country: 'United State', flag: 'us' },
  { label: 'Arabic', value: 'ar', country: 'Arabic', flag: 'kw' },
  { label: 'Spanish', value: 'es', country: 'Spain', flag: 'es' },
  { label: 'French', value: 'fr', country: 'France', flag: 'fr' },
  { label: 'Hindi', value: 'hi', country: 'India', flag: 'in' },
  { label: 'Russian', value: 'ru', country: 'Russia', flag: 'ru' },
  { label: 'Japanese', value: 'ja', country: 'Japan', flag: 'jp' },
  { label: 'Korean', value: 'ko', country: 'Korea', flag: 'kr' },
  { label: 'Chinese', value: 'zh-CN', country: 'China', flag: 'cn' },
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
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const t1 = useTranslations('LocaleSwitcher');
  const t2 = useTranslations('CurrencySwitcher');
  const [isPending, startTransition] = useTransition();
  const [currentTab, setCurrentTab] = useState(0);

  const currencyExchangeOptions = currencyData?.reduce((acc: any, curr: any) => {
    currencyExchanges?.map((item: any) => {
      if (item?.currency === curr?.code) {
        acc?.push(curr);
      }
    });
    return acc;
  }, []);

  console.log({ currencyExchanges });

  useEffect(() => {
    (async () => {
      const locale = await getUserLocale();
      const currency = await getUserCurrency();
      setSelectedOption(locale);
      setSelectedCurrency(currency);
      setCurrentCurrency(currency);
    })();
  }, [currencyExchanges, dispatch]);

  // handle language
  const handleLanguageChange = (locale: Locale) => {
    setSelectedOption(locale);

    startTransition(() => {
      setUserLocale(locale);
      setCurrentTab(1);
      dispatch(resetState());
    });
  };
  // handle currency
  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);

    startTransition(() => {
      setUserCurrency(currency);
      const currencyExchange = currencyExchanges?.find((item: any) => item?.currency === currency);
      dispatch(setCurrency({ name: currencyExchange?.currency, exchangeRate: currencyExchange?.exchangeRate }));
    });
    setModalState(false);
  };

  const handleTabChange = (index: number) => {
    setCurrentTab(index);
  };

  return (
    <Modal
      isOpen={modalState}
      onClose={() => {
        setModalState(false);
        setCurrentTab(0);
      }}
      customSize="630px"
    >
      <div className="m-auto px-7 pb-3 pt-5">
        <div className="flex items-center justify-end">
          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
              setCurrentTab(0);
            }}
          >
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>

        <Tab selectedIndex={currentTab} onChange={handleTabChange}>
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
                <h3 className="mb-5 text-center text-lg font-semibold">{t1('selectPreferableLanguage')}</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {languageOptions?.map((lang: any) => (
                    <AdvancedRadio
                      key={lang.value}
                      onClick={() => handleLanguageChange(lang?.value)}
                      name="language"
                      value={lang.value}
                      contentClassName={`rounded-lg border hover:border-danger ${selectedOption === lang?.value ? '!border-danger ring-1 !ring-danger' : '!ring-0'}`}
                      inputClassName="[&:checked~span_.icon]:block"
                    >
                      <span className="flex items-center justify-center gap-x-2">
                        <img src={`https://flagcdn.com/${lang.flag}.svg`} height={10} width={25} alt={lang.flag} />
                        <Text as="b">{lang?.label}</Text>
                      </span>
                    </AdvancedRadio>
                  ))}
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="my-5">
                <h3 className="mb-5 text-center text-lg font-semibold">{t2('selectPreferableCurrency')}</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currencyExchanges?.map((currency: any) => (
                    <AdvancedRadio
                      key={currency._id}
                      onClick={() => handleCurrencyChange(currency?.currency)}
                      name="currency"
                      value={currency?.currency}
                      contentClassName={`rounded-lg border hover:border-danger ${selectedCurrency === currency?.currency ? '!border-danger ring-1 !ring-danger' : '!ring-0'}`}
                      inputClassName="[&:checked~span_.icon]:block"
                    >
                      <span className="flex flex-col">
                        <Text as="b">{currency?.name}</Text>
                        <span>
                          {currency?.currency} - {currency?.currencyIcon}
                        </span>
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
