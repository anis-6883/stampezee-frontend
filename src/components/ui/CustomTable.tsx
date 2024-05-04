import { debounce } from '@/utils/debounce';
import { ActionIcon, Box } from '@mantine/core';
import { MRT_PaginationState, MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import Link from 'next/link';
import { HiOutlinePencil } from 'react-icons/hi2';
import DeleteConfirmation from '../deleteModal/DeleteConfirmation';

interface Column<T> {
  accessorFn: (originalRow: Record<string, any>) => any;
  id: string;
  header: string;
}

interface IPagination {
  pageIndex: number;
  pageSize: number;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: Record<string, any>[];
  pagination: IPagination;
  totalDocs?: number;
  setPagination: (pagination: MRT_PaginationState | ((oldState: MRT_PaginationState) => MRT_PaginationState)) => void;
  deleteRow: (id: string) => void;
  editRow: (id: number | string) => string;
  setQuery: Function;
  isLoading: boolean;
  searchField?: string;
  rowActions?: any;
}

export default function CustomTable<T>({
  columns,
  data,
  pagination,
  setPagination,
  totalDocs,
  deleteRow,
  editRow,
  isLoading,
  setQuery,
  searchField = 'title',
  rowActions,
}: CustomTableProps<T>) {
  const handleFilter = (keyword: string) => {
    // @ts-ignore
    if (setQuery) {
      setQuery(keyword?.length > 3 ? { search: `${searchField}:${keyword}` } : {});
    }
  };
  const debounceFilter = debounce(handleFilter, 500);

  const table = useMantineReactTable({
    columns,
    data,
    rowCount: totalDocs,
    enableRowSelection: false,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableColumnOrdering: true,
    manualPagination: true,
    enableFilterMatchHighlighting: false,
    onPaginationChange: setPagination,
    state: {
      isLoading: isLoading,
      showProgressBars: isLoading,
      pagination,
    },
    initialState: {
      showGlobalFilter: true,
    },
    enableToolbarInternalActions: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableColumnDragging: false,
    enableSorting: false,
    mantinePaginationProps: {
      rowsPerPageOptions: ['5', '10', '25', '40'],
      withEdges: false,
    },
    mantineSearchTextInputProps: {
      placeholder: 'Please type atleast 3 words',
    },
    onGlobalFilterChange: debounceFilter,
    renderRowActions: rowActions
      ? rowActions
      : ({ row }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            <ActionIcon color="orange">
              <Link href={editRow(row.original.id)}>
                <HiOutlinePencil className="text-base" />
              </Link>
            </ActionIcon>
            <ActionIcon color="red">
              <DeleteConfirmation
                id={row.original.id}
                deleteFunction={deleteRow}
                /**
                 * @important add more title options here according to the project after || (OR) operation
                 */
                title={
                  row.original.title && row.original.title.length > 20
                    ? `${row.original.title.substring(0, 20)}...`
                    : row.original.title || row.original.name
                }
              />
            </ActionIcon>
          </Box>
        ),
  });

  return <MantineReactTable table={table} />;
}
