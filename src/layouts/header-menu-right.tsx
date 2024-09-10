import { routes } from '@/config/routes';
import ProfileMenu from '@/layouts/profile-menu';
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';

export default function HeaderMenuRight() {
  // const [modalState, setModalState] = useState<boolean>(false);
  return (
    <div className="ms-auto grid shrink-0 grid-cols-2 items-center gap-x-5 text-gray-700 xs:gap-x-3 ">
      {/* <div className="ml-3">
        <AiOutlineGlobal
          onClick={() => setModalState(true)}
          className="h-9 w-9 cursor-pointer rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
        />
      </div> */}
      <div className="text-base font-semibold text-danger">
        <Link className="flex items-center gap-x-2 " href={routes.publicRoutes.home}>
          <IoHomeOutline className="text-lg text-danger" />
          Go to Home
        </Link>
      </div>
      <ProfileMenu />
    </div>
  );
}
