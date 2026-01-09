import AddIcon from "@mui/icons-material/Add";

import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function CreateMenu() {
  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Create</h1>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="bg-blue-100 border border-blue-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-blue-900 max-w-xs truncate">
            Add
            <br />
            <strong>Entry</strong>
          </h2>
          <Link to="/entry">
            <Button className="!rounded-full h-10 ps-4 pe-6 mt-8">
              <AddIcon className="me-1" />
              Create
            </Button>
          </Link>
        </div>

        <div className="bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-indigo-900">
            Create
            <br />
            <strong>Ledgers</strong>
          </h2>

          <Link to="/ledger">
            <Button className="!rounded-full h-10 ps-4 pe-6 mt-8">
              <AddIcon className="me-1" />
              Create
            </Button>
          </Link>
        </div>

        <div className="bg-red-100 border border-red-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-indigo-900">
            Create
            <br />
            <strong>Book</strong>
          </h2>
          <Button className="!rounded-full h-10 ps-4 pe-6 mt-8" disabled={true}>
            <AddIcon className="me-1" />
            Create
          </Button>
        </div>
      </div>
    </>
  );
}
