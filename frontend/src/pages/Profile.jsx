import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Button from "../components/Button";

function DataView({ title = "", data = "" }) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm/6 font-medium text-gray-900">{title}</dt>
      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
        {data || <span className="text-gray-300 italic">No Data</span>}
      </dd>
    </div>
  );
}

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Profile</h1>

      <div className="bg-white rounded-xl p-4">
        <div className="px-4 sm:px-0 mt-2">
          <h3 className="text-base font-semibold text-gray-900">
            Personal Detail
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            This information will be displayed publicly
          </p>
        </div>
        <div className="mt-4 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <DataView
              title="Full Name"
              data={`${user?.firstName} ${user?.middleName || ""} ${
                user?.lastName
              }`}
            />
            <DataView title="Email Address" data={user?.email} />
            <DataView title="Location" data={user?.location} />
          </dl>
        </div>

        <div className="px-4 sm:px-0 mt-6">
          <h3 className="text-base font-semibold text-gray-900">Profession</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            These details help your colleagues look you up
          </p>
        </div>
        <div className="mt-4 border-t border-gray-100">
          <dl>
            <DataView title="Organization" data={user?.organization} />
            <DataView title="Job Title" data={user?.jobTitle} />
            <DataView title="Bio" data={user?.bio} />
          </dl>
        </div>

        <Link to="./edit">
          <Button className="h-12 w-auto px-4 mt-2" variant="primary">
            Edit
          </Button>
        </Link>
      </div>
    </>
  );
}
