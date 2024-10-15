import { axiosBackendUrl } from '@/utils/axios/getAxios';
import React from 'react';
import Footer from './components/web/Footer';
import HeaderContent from './components/web/HeaderContent';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  return (
    <div>
      <HeaderContent />
      <div className="lg:mt-[60px]">{children}</div>
      <Footer general={data?.data?.general} />
    </div>
  );
}
