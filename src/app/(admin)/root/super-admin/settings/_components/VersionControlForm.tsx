import AndroidVersionControlForm from './AndroidVersionControlForm';
import IOSVersionControlForm from './IOSVersionControlForm';

const VersionControlForm = () => {
  return (
    <div className="space-y-5">
      <IOSVersionControlForm />
      <AndroidVersionControlForm />
    </div>
  );
};

export default VersionControlForm;
