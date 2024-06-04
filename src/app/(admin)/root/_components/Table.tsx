import { IQueryType } from '@/types';
import { MRT_Row, MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

type props = {
  response: any;
  structure: any;
  tableProperties?: any;
  query?: IQueryType;
  enablePagination?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  enableRowActions?: boolean;
  enableDnD?: boolean;
  setQuery?: Function;
  sort?: Function;
  sortContext?: string;
  searchPlaceHolder?: string;
};

export default function Table({
  isLoading,
  isFetching,
  response,
  structure,
  tableProperties = {},
  setQuery,
  query,
  enablePagination = true,
  enableRowActions = false,
  enableDnD = false,
  sort,
  sortContext,
  searchPlaceHolder = 'Search',
}: props) {
  const { data, pagination } = response;

  const handleFilter = (keyword: string) => {
    // @ts-ignore
    if (setQuery) {
      setQuery((prev: IQueryType) => {
        return {
          ...prev,
          search: keyword,
        };
      });
    }
  };

  const columns = useMemo<MRT_ColumnDef[]>(() => structure, [structure]);

  const table = useMantineReactTable({
    columns,
    data,
    ...tableProperties,
    mantineSearchTextInputProps: {
      placeholder: searchPlaceHolder,
      sx: { minWidth: '100px' },
      variant: 'outlined',
    },
    positionGlobalFilter: 'left',
    initialState: {
      showGlobalFilter: true,
    },
    ...(enablePagination && {
      manualPagination: pagination,
      mantinePaginationProps: {
        rowsPerPageOptions: ['10', '25', '50'],
        withEdges: false,
      },
      rowCount: pagination && pagination.totalDocuments,
      state: {
        isLoading: isLoading,
        showProgressBars: isFetching,
        pagination: {
          // @ts-ignore
          pageIndex: query?.pageIndex as number,
          // @ts-ignore
          pageSize: query?.pageSize as number,
        },
      },
      onPaginationChange: setQuery,
    }),
    ...(!enablePagination && {
      state: {
        isLoading: isLoading,
        showProgressBars: isFetching,
      },
    }),
    enablePagination: enablePagination,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableRowActions: enableRowActions,
    positionActionsColumn: 'last',
    enableToolbarInternalActions: false,
    enableColumnActions: false,
    onGlobalFilterChange: handleFilter,
    enableSorting: enableDnD,

    ...(enableDnD && {
      enableRowDragging: true,
      enableRowOrdering: true,
      mantineRowDragHandleProps: ({ table }) => ({
        onDragEnd: async () => {
          const { draggingRow, hoveredRow } = table.getState();
          if (hoveredRow && draggingRow) {
            const rowData = [...data]; // Shallow Copy
            rowData.splice((hoveredRow as MRT_Row<any>).index, 0, rowData.splice(draggingRow.index, 1)[0]);
            const sortIds = rowData.map((row: any) => row._id);

            if (sort) {
              const response: any = await sort({
                title: sortContext,
                sortedData: sortIds,
              });

              if (response?.data?.status == true) {
                toast.success('Sorting successfully!');
              }
            }
          }
        },
      }),
    }),
  });

  return <MantineReactTable table={table} />;
}
