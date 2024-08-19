import { HiOutlineCog8Tooth } from 'react-icons/hi2';

export default function TabButtonItem({ tab, onClick, active }: { tab: string; onClick: () => void; active: boolean }) {
  // return <Button text={tab} color={active ? 'danger' : 'outline'} onClick={onClick} className="cursor-pointer uppercase" />;
  return (
    <div onClick={onClick} className={`mb-2 cursor-pointer rounded-md border ${active ? 'border-danger bg-danger' : ''}`}>
      <h2 className="flex items-center gap-2 p-2">
        <div className={`border-r-2 ${active ? 'border-light' : ''} pr-2`}>
          <HiOutlineCog8Tooth className={`text-xl ${active ? 'text-light' : ''}`} />
        </div>
        <span className={`font-semibold ${active ? 'text-light' : ''}`}>{tab}</span>
      </h2>
    </div>
  );
}
