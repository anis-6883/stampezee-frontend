import { RiCheckFill } from 'react-icons/ri';

interface CustomCheckboxProps {
  checked: boolean;
  size?: string; // optional, like 'w-5 h-5' or 'w-6 h-6'
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, size = 'w-5 h-5' }) => {
  return (
    <div
      className={`flex items-center justify-center rounded border ${size} cursor-pointer transition 
        ${checked ? 'border-danger bg-danger text-white' : 'border-gray-300 bg-white'}`}
    >
      {checked && <RiCheckFill className="text-2xl text-white" />}
    </div>
  );
};
