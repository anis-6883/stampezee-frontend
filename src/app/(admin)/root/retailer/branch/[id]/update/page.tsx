import UpdateBranch from '../../_components/UpdateBranch';

export default function Page({ params }: any) {
  const { id } = params;

  return (
    <div>
      <UpdateBranch branchId={id} />
    </div>
  );
}
