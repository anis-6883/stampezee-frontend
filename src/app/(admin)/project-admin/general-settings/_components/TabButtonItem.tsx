export default function TabButtonItem({ tab, onClick, active }: { tab: string; onClick: () => void; active: boolean }) {
  return (
    <div
      onClick={onClick}
      className={`uppercase cursor-pointer transition-colors ${!active ? "bg-white border border-primary duration-300" : "bg-primary duration-300"} rounded-md mb-2 py-2 px-2`}
    >
      {tab}
    </div>
  );
}
