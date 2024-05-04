'use client';
import { useDeleteUserMutation, useGetUsersQuery } from '@/features/user/userApi';
import { MRT_PaginationState, type MRT_ColumnDef } from 'mantine-react-table';
import { useMemo, useState } from 'react';

import { routes } from '@/config/routes';
import CustomTable from '../../../../../components/ui/CustomTable';
import { LOADING_DATA } from '@/config/constants';

interface User {
  email: string;
  name: string;
}

export default function UserTable() {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [query, setQuery] = useState({});
  const { isLoading, data: userData } = useGetUsersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(query && { ...query }),
  });

  const [deleteUser] = useDeleteUserMutation();

  const data: User[] = userData?.data?.docs ? userData?.data?.docs : [];

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorFn: (originalRow) => originalRow.email,
        id: 'email',
        header: 'Email',
      },
      {
        accessorFn: (originalRow) => originalRow.name,
        id: 'name',
        header: 'Name',
      },
    ],
    []
  );

  return (
    <CustomTable<User>
      columns={columns as []}
      isLoading={isLoading}
      data={isLoading ? LOADING_DATA : data}
      pagination={pagination}
      setPagination={setPagination}
      totalDocs={userData?.data?.totalDocs}
      deleteRow={deleteUser as any}
      editRow={routes?.admin?.user?.edit}
      setQuery={setQuery}
    />
  );
}
