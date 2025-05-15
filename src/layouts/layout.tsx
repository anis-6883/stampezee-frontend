import { ROLE } from '@/config/constants';
import { useRetailerGetProfileQuery, useSuperAdminGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import Header from '@/layouts/header';
import Sidebar from '@/layouts/sidebar';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function HydrogenLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data: session, update } = useSession();
  const { role, accessToken } = useSelector((state: RootState) => state.authSlice);

  const { data: retailerProfile, isSuccess: retailerProfileSuccess } = useRetailerGetProfileQuery(null, {
    skip: !accessToken || role !== ROLE.RETAILER,
  });
  const { data: superAdminProfile, isSuccess: superAdminProfileSuccess } = useSuperAdminGetProfileQuery(null, {
    skip: !accessToken || role !== ROLE.SUPER_ADMIN,
  });

  useEffect(() => {
    if (role === ROLE.RETAILER && retailerProfileSuccess) {
      update({ ...session?.user, ...retailerProfile?.data });
      dispatch(
        setValue({
          target: 'user',
          value: { ...session?.user, ...retailerProfile?.data },
        })
      );
    }
    if (role === ROLE.SUPER_ADMIN && superAdminProfileSuccess) {
      update({ ...session?.user, ...superAdminProfile?.data });
      dispatch(
        setValue({
          target: 'user',
          value: { ...session?.user, ...superAdminProfile?.data },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, retailerProfile?.data, retailerProfileSuccess, superAdminProfile?.data, superAdminProfileSuccess, role]);
  return (
    <main className="flex min-h-screen flex-grow">
      <Sidebar className="fixed hidden dark:bg-gray-50 sxl:block" />
      <div className="2xl:ms-72 2xl:w-[calc(100%-288px)] flex w-full flex-col sxl:ms-[270px] sxl:w-[calc(100%-270px)]">
        <Header />
        <div className=" ml-4 flex flex-grow flex-col px-4 pb-6 pt-2 md:px-5 lg:px-6 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-10 4xl:pb-9">
          {children}
        </div>
      </div>
    </main>
  );
}
