import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';
import '../quill.css';

export const metadata = {
  ...metaObject('Terms and Conditions'),
};

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 text-gray-900">
      <div className="m-10 w-full rounded-lg bg-white p-8 shadow md:max-w-7xl">
        <Link href={routes.publicRoutes.home}>
          <IoHomeOutline className="text-lg text-danger" />
        </Link>
        <Link href={routes.publicRoutes.home}>
          <img src="/images/logo.png" className="mx-auto w-28" alt="logo" />
        </Link>
        <h1 className="mt-3 text-center text-2xl font-bold lg:text-3xl">Terms and Conditions</h1>
        <hr className="my-7" />
        <div className="ql-editor !h-auto">
          <div dangerouslySetInnerHTML={{ __html: data?.data?.page?.terms ?? '' }} />
        </div>
      </div>
    </div>
  );
}
