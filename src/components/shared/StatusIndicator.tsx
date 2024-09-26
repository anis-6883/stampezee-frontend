import { useTranslations } from 'next-intl';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { Switch } from 'rizzui';

export default function StatusIndicator() {
  const t = useTranslations('StatusIndicator');
  return (
    <div className="flex w-auto items-center justify-center gap-x-3 rounded-md border border-solid px-3">
      <span className="font-bold">{t('status')}: </span>
      <div className="flex items-center justify-center space-x-2 pr-3">
        <span className="select-none font-medium">{t('active')}</span>
        <Switch
          checked={true}
          switchClassName="cursor-auto bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
          switchKnobClassName="bg-light"
          variant="flat"
          labelClassName="select-none"
          onIcon={<FcUnlock />}
        />
      </div>
      <div className="flex items-center justify-end space-x-2">
        <span className="select-none font-medium">{t('inactive')}</span>

        <Switch
          checked={false}
          switchClassName="cursor-auto bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
          switchKnobClassName="bg-light"
          variant="flat"
          labelClassName="select-none"
          offIcon={<FcLock />}
        />
      </div>
    </div>
  );
}
