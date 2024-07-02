'use client';

import ChangePasswordModal from '@/components/changePasswordModal/ChangePasswordModal';
import UpdateProfileModal from '@/components/updateProfileModal/UpdateProfileModal';
import { routes } from '@/config/routes';
import { useGetOwnProfileQuery } from '@/features/auth/authApi';
import { userLoggedOut } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Popover, Text, Title } from 'rizzui';

const menuItems = [
  {
    name: 'My Profile',
    href: '#',
  },
  {
    name: 'Change Password',
    // href: '#',
  },
];

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
  const { data: profileData, isSuccess, isLoading } = useGetOwnProfileQuery(null);

  // Handle Logout Response
  const handleLogout = async () => {
    dispatch(userLoggedOut(undefined));

    await signOut({
      redirect: false,
      callbackUrl: role === 'super_admin' ? routes.superAdmin.login : routes.retailer.login,
    });

    replace(role === 'super_admin' ? routes.superAdmin.login : routes.retailer.login);
  };

  let fullName = profileData?.data?.firstName + ' ' + profileData?.data?.lastName;

  return (
    <div className="w-64 text-left rtl:text-right">
      <div className="flex items-center border-b border-gray-300 px-6 pb-5 pt-6">
        <Avatar
          src={
            profileData?.data?.image
              ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${profileData?.data?.image}`
              : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
          }
          name={fullName ?? ''}
        />
        <div className="ms-3">
          <Title as="h6" className="font-semibold">
            {fullName ?? ''}
          </Title>
          <Text className="text-gray-600">{profileData?.data?.email ?? ''}</Text>
        </div>
      </div>
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
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function ProfileMenu({ buttonClassName, avatarClassName }: { buttonClassName?: string; avatarClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [changePasswordModalState, setChangePasswordModalState] = useState(false);
  const [updateProfileModalState, setUpdateProfileModalState] = useState(false);
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.authSlice);
  const { data: profileData, isSuccess, isLoading } = useGetOwnProfileQuery(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <Popover enableOverlay placement="bottom-start">
        <Popover.Trigger>
          <div className="w-12 cursor-pointer">
            <Avatar
              name="Jane Doe"
              src={
                profileData?.data?.image
                  ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${profileData?.data?.image}`
                  : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
              }
              size="lg"
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
