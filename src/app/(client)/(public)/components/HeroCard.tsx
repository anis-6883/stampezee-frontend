import { useTranslations } from 'next-intl';
import Featured from './Featured';

export const HeroCard = () => {
  const t = useTranslations('HomePage');
  return (
    <div className="p-3 md:p-0">
      <Featured image="/default/why-stamp.png" title={t('heroTitleOne')} description={t('heroDescriptionOne')} bgHeight="py-20" />
      <Featured
        imagePosition="right"
        image="/default/empower.png"
        title={t('heroTitleTwo')}
        description={t('heroDescriptionTwo')}
        bgHeight="py-20"
      />
    </div>
  );
};
