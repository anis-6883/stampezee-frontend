import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';

export const metadata = {
  ...metaObject('Terms and Conditions'),
};

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    // <div className="mx-auto min-h-screen w-full max-w-7xl bg-[#F6F8FC] p-4 lg:px-12 lg:py-10">
    //   <Link href={routes.publicRoutes.home}>
    //     <img src="/images/logo.png" className="mx-auto w-28" alt="logo" />
    //   </Link>
    //   <h1 className="my-7 text-center text-2xl font-bold lg:text-3xl">Terms & Condition</h1>
    //   <div dangerouslySetInnerHTML={{ __html: data?.data?.page?.terms ? data?.data?.page?.terms : '' }}></div>
    // </div>
    <div className="flex min-h-screen justify-center bg-gray-100 text-gray-900">
      <div className="m-10 w-full rounded-lg bg-white p-8 shadow md:max-w-7xl">
        <Link href={routes.publicRoutes.home}>
          <IoHomeOutline className="text-lg text-danger" />
        </Link>
        <Link href={routes.publicRoutes.home}>
          <img src="/images/logo.png" className="mx-auto w-28" alt="logo" />
        </Link>
        <h1 className="my-7 text-center text-2xl font-bold lg:text-3xl">Terms & Condition</h1>
        <div dangerouslySetInnerHTML={{ __html: data?.data?.page?.terms ? data?.data?.page?.terms : '' }}></div>
      </div>
    </div>
  );
}
