'use client';
import CreateBranch from '../_components/CreateBranch';

export default function page() {
  return (
    <div>
      <h2 className="text-3xl font-semibold">Create a new branch </h2>
      <hr />
      <CreateBranch />
    </div>
  );
}
