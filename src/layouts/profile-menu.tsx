'use client';

import BalanceCard from '@/app/(client)/(public)/components/BalanceCard';
import ChangePasswordModal from '@/components/changePasswordModal/ChangePasswordModal';
import UpdateProfileModal from '@/components/updateProfileModal/UpdateProfileModal';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { userLoggedOut } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popover, Title } from 'rizzui';

function DropdownMenu({
  setOpen,
  setChangePasswordModalState,
  setUpdateProfileModalState,
}: {
  setOpen: any;
  setChangePasswordModalState: any;
  setUpdateProfileModalState: any;
}) {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state: RootState) => state.authSlice);
  const { data: session }: any = useSession();

  // Handle Logout Response
  const handleLogout = async () => {
    dispatch(userLoggedOut(undefined));

    await signOut({
      redirect: false,
      callbackUrl: role === 'super_admin' ? routes.superAdmin.login : routes.retailer.login,
    });

    replace(role === 'super_admin' ? routes.superAdmin.login : routes.retailer.login);
  };

  let fullName = user?.firstName + ' ' + user?.lastName;

  if (fullName.length >= 18) {
    const lastName = user?.lastName ? user?.lastName.charAt(0).toUpperCase() : '';
    fullName = user?.firstName + ' ' + lastName + '.';
  }

  return (
    <div className="w-64 text-left rtl:text-right">
      {user?.role === ROLE.RETAILER && (
        <div className="m-4 flex flex-col items-center gap-4 rounded-lg bg-[#F4F6F8] p-3">
          <img
            src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
            color="danger"
            className="h-14 w-14 rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
            alt="brand"
          />
          <Title as="h6" className="break-all text-center font-bold">
            {user?.storeName && user?.storeName.length > 20 ? user?.storeName.slice(0, 20) + '...' : user?.storeName}
          </Title>
        </div>
      )}

      {user?.role === ROLE.SUPER_ADMIN && (
        <div className="m-4 flex flex-col items-center gap-4 rounded-lg bg-[#F4F6F8] p-3">
          <img
            src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
            color="danger"
            className="h-14 w-14 rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
            alt="brand"
          />
          <Title as="h6" className="break-all text-center font-bold">
            {fullName}
          </Title>
        </div>
      )}

      {session?.user?.plan && <BalanceCard />}
      <div className="grid px-3.5 py-3.5 font-medium text-gray-700">
        {role === 'retailer' && (
          <Link
            href={routes.retailer.profile}
            onClick={() => setOpen(false)}
            className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
          >
            My Profile
          </Link>
        )}
        {role === 'super_admin' && (
          <button
            onClick={() => {
              setUpdateProfileModalState(true);
              setOpen(false);
            }}
            className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
          >
            Update Profile
          </button>
        )}
        <button
          onClick={() => {
            setChangePasswordModalState(true);
            setOpen(false);
          }}
          className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
        >
          Change Password
        </button>
      </div>
      <div className="border-t border-gray-300 px-6 pb-6 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-900 outline-none focus-within:text-gray-600 hover:text-danger focus-visible:ring-0"
          variant="text"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function ProfileMenu() {
  const [changePasswordModalState, setChangePasswordModalState] = useState(false);
  const [updateProfileModalState, setUpdateProfileModalState] = useState(false);
  const { user } = useSelector((state: RootState) => state.authSlice);

  return (
    <>
      <Popover enableOverlay placement="bottom-start">
        <Popover.Trigger>
          <div className="cursor-pointer">
            <img
              src={user?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user?.image}` : '/images/stamp-logo.png'}
              color="danger"
              className="h-12 w-12 rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
              alt="brand"
            />
          </div>
        </Popover.Trigger>
        <Popover.Content>
          {({ setOpen }) => (
            <DropdownMenu
              setOpen={setOpen}
              setChangePasswordModalState={setChangePasswordModalState}
              setUpdateProfileModalState={setUpdateProfileModalState}
            />
          )}
        </Popover.Content>
      </Popover>
      <ChangePasswordModal modalState={changePasswordModalState} setModalState={setChangePasswordModalState} />
      <UpdateProfileModal modalState={updateProfileModalState} setModalState={setUpdateProfileModalState} />
    </>
  );
}
