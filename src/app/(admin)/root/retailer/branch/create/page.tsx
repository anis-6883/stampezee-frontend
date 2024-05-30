'use client';
import CreateBranch from '../_components/CreateBranch';

export default function page() {
  return (
    <div>
      <h2 className="mb-2 text-center text-3xl font-semibold">Create a new branch </h2>
      {/* <hr /> */}
      <CreateBranch />
    </div>
  );
}
