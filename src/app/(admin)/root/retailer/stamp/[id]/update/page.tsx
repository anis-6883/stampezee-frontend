import Update from '../../_components/Update';

export default function Page({ params }: any) {
  const { id } = params;

  return (
    <div>
      <Update Id={id} />
    </div>
  );
}
