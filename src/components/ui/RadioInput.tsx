export default function RadioInput({ name, value, checked, onChange }: { name?: string; value?: string; checked: boolean; onChange: any }) {
  return (
    <div>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="hidden" />
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
          checked ? 'border-[0.5px] border-red-500' : 'border-gray-400'
        }`}
      >
        {checked && <div className="h-3 w-3 rounded-full bg-red-500"></div>}
      </div>
    </div>
  );
}
