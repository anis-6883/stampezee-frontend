import Button from '../../../_components/Button';

export default function TabButtonItem({ tab, onClick, active }: { tab: string; onClick: () => void; active: boolean }) {
  return <Button text={tab} color={active ? 'danger' : 'outline'} onClick={onClick} className="cursor-pointer uppercase" />;
}
