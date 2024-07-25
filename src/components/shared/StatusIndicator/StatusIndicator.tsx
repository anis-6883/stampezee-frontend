import { FcLock, FcUnlock } from 'react-icons/fc';
import { Switch } from 'rizzui';

export default function StatusIndicator() {
  return (
    <div className="rounded-md border border-solid">
      <div className="flex items-center justify-center gap-x-3 px-3">
        <span className="font-bold">Status: </span>
        <div className="flex items-center justify-center space-x-2 pr-3">
          <span className="font-medium">Active</span>
          <Switch
            checked={true}
            switchClassName="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
            switchKnobClassName="bg-light"
            variant="flat"
            labelClassName="select-none"
            onIcon={<FcUnlock />}
          />
        </div>
        <div className="flex items-center justify-end space-x-2">
          <span className="font-medium">Inactive</span>

          <Switch
            checked={false}
            switchClassName="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
            switchKnobClassName="bg-light"
            variant="flat"
            labelClassName="select-none"
            offIcon={<FcLock />}
          />
        </div>
      </div>
    </div>
  );
}
