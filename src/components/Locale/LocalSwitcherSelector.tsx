import { Locale } from '@/config';
import { getUserLocale, setUserLocale } from '@/services/locale';
import { useEffect, useState, useTransition } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { ActionIcon, Dropdown } from 'rizzui';

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Arabic', value: 'ar' },
];

export default function LocalSwitcherSelector() {
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    (async () => {
      const locale = await getUserLocale();
      setSelectedOption(locale);
    })();
  }, []);

  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (locale: Locale) => {
    setSelectedOption(locale);

    startTransition(() => {
      setUserLocale(locale);
    });
  };
  return (
    <Dropdown placement="bottom-start">
      <Dropdown.Trigger>
        <ActionIcon variant="outline" rounded="full">
          <AiOutlineGlobal className="text-xl" />
        </ActionIcon>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {languageOptions?.map((lang: any) => (
          <Dropdown.Item onClick={() => handleLanguageChange(lang?.value)} key={lang?.value}>
            <div className="flex w-full items-center justify-between">
              <span>{lang?.label}</span>
              {selectedOption === lang?.value && (
                <span>
                  <IoMdCheckmarkCircleOutline className="text-lg" />
                </span>
              )}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
