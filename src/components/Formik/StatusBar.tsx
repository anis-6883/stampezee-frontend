// import { useEffect, useState } from 'react';
// import { Switch } from 'rizzui';

// const StatusBar = ({ setFieldValue, checkedStatus = true }: any) => {
//   const [status, setStatus] = useState(true);
//   useEffect(() => {
//     setStatus(checkedStatus);
//   }, [checkedStatus, status]);

//   const handleToggle = () => {
//     setStatus(!status);
//     setFieldValue('status', !status);
//     console.log(status, 'click status');
//   };

//   return (
//     <div className="status-bar">
//       <Switch label="Status" variant="outline" labelPlacement="right" className="hover" checked={status} onChange={handleToggle} />
//     </div>
//   );
// };

// export default StatusBar;

// import { useState } from 'react';
// import { Switch } from 'rizzui';

// const StatusBar = ({ setFieldValue, checkedStatus = false }: any) => {
//   // State to manage the status
//   console.log(checkedStatus, 'checkedStatus');

//   const [status, setStatus] = useState(checkedStatus);
//   console.log('status', status);

//   // Handler to toggle the status
//   const handleToggle = () => {
//     setStatus(!status);
//     setFieldValue('status', !status);
//   };

//   return (
//     <div className="status-bar">
//       <Switch label="Status" variant="outline" labelPlacement="right" className="hover" checked={status} onChange={handleToggle} />
//     </div>
//   );
// };

// export default StatusBar;
import React, { useEffect, useState } from 'react';
import { Switch } from 'rizzui';

interface StatusBarProps {
  setFieldValue: (field: string, value: any) => void;
  checkedStatus?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ setFieldValue, checkedStatus = true }) => {
  const [status, setStatus] = useState(checkedStatus);
  console.log(checkedStatus, 'check status');

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
      <Switch label="Status" variant="outline" labelPlacement="right" className="hover" checked={status} onChange={handleToggle} />
    </div>
  );
};

export default StatusBar;
