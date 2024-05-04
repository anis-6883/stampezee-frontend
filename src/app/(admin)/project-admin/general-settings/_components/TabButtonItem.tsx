export default function TabButtonItem({ tab, onClick, active }: { tab: string; onClick: () => void; active: boolean }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer uppercase transition-colors ${!active ? 'border border-primary bg-white duration-300' : 'bg-primary duration-300'} mb-2 rounded-md px-2 py-2`}
    >
      {tab}
    </div>
  );
}
