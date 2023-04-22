import React, { useState } from "react";
import { useSelector } from "react-redux";
import fileDownload from "js-file-download";
import axios from "axios";
import { GET_EXPORT_JOURNAL_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export default function Export() {
  const { user, token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    const { data: csv } = await axios.get(
      GET_EXPORT_JOURNAL_URL,
      authConfig(token)
    );
    fileDownload(csv, `journal_export_${user.id}_${new Date().getTime()}.csv`);
    setIsLoading(false);
  };

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-2xl font-bold">Export</h1>
            </div>

            <p className="text-justify text-xs mt-2">
              Download all journal entries in csv format.
            </p>

            <button
              className={`btn bg-primary text-white w-full mt-4  ${
                isLoading ? "loading" : null
              }`}
              onClick={handleExport}
            >
              Export
            </button>
          </div>
        </div>
      </center>
    </div>
  );
}
