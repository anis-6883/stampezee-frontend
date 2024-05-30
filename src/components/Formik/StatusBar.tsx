// export default StatusBar;
import React, { useEffect, useState } from 'react';
import { Switch } from 'rizzui';

interface StatusBarProps {
  setFieldValue: (field: string, value: any) => void;
  checkedStatus?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ setFieldValue, checkedStatus = true }) => {
  const [status, setStatus] = useState(checkedStatus);

  useEffect(() => {
    setStatus(checkedStatus);
    setFieldValue('status', checkedStatus);
  }, [checkedStatus, setFieldValue]);

  const handleToggle = () => {
    const newStatus = !status;
    setStatus(newStatus);
    setFieldValue('status', newStatus);
    console.log(newStatus, 'click status');
  };

  return (
    <div className="status-bar">
      {/* <Switch label="Status" variant="outline" labelPlacement="right" checked={status} onChange={handleToggle} /> */}
      <Switch
        label="Status"
        switchKnobClassName="bg-[#3872FA]"
        variant="outline"
        labelPlacement="right"
        checked={status}
        onChange={handleToggle}
      />
    </div>
  );
};

export default StatusBar;
