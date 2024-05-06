'use client';

import Table from '../../components/Table';

export default function RetailerTable() {
  const structure = [
    {
      header: 'Language',
      accessorKey: 'language',
      enableSorting: false,
    },
    {
      header: 'Manna',
      accessorKey: 'manna',
      enableSorting: false,
    },
    {
      header: 'Publish Date',
      accessorKey: 'publishDate',
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      enableSorting: false,
    },
  ];

  return (
    <Table
      isFetching={false}
      isLoading={false}
      enableRowActions={false}
      response={
        true
          ? {
              data: [],
              pagination: {
                totalDocuments: 0,
              },
            }
          : {
              data: [],
              pagination: {
                totalDocuments: 0,
              },
            }
      }
      structure={structure}
    />
  );
}
