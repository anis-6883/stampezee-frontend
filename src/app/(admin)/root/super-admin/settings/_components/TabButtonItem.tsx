export default function TabButtonItem({
  tab,
  icon,
  onClick,
  active,
}: {
  tab: string;
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div onClick={onClick} className={`mb-2 cursor-pointer rounded-md border ${active ? 'border-danger bg-danger' : ''}`}>
      <h2 className="flex items-center gap-2 p-2">
        <div className={`border-r-2 ${active ? 'border-light text-light' : ''} pr-2`}>{icon}</div>
        <span className={`font-semibold ${active ? 'text-light' : ''}`}>{tab}</span>
      </h2>
    </div>
  );
}
