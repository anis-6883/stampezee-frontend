import { useState } from 'react';
import { Switch } from 'rizzui';

const StatusBar = ({ setFieldValue }: any) => {
  // State to manage the status
  const [status, setStatus] = useState(true);

  // Handler to toggle the status
  const handleToggle = () => {
    setStatus(!status);
    setFieldValue('status', status);
  };

  return (
    <div className="status-bar">
      <Switch label="Status" variant="outline" labelPlacement="right" className="hover" checked={status} onChange={handleToggle} />
    </div>
  );
};

export default StatusBar;
