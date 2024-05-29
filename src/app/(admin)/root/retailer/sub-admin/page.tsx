import MainTable from '../stamps/_components/MainTable';

export default function Page() {
  return (
    <div>
      <div className="flex justify-end">
        <button className="mb-5 animate-bounce rounded-lg bg-red-500 p-2 text-white shadow-md">create sub-admin</button>
      </div>
      <MainTable />
    </div>
  );
}
