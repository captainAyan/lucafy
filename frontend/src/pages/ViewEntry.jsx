import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { GET_ENTRY_URL } from "../constants/api";

export default function ViewEntry() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [entry, setEntry] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const getEntry = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(`${GET_ENTRY_URL}${id}`, config);

      setEntry({
        ...response.data,
        debit: response.data.debit_ledger,
        credit: response.data.credit_ledger,
      });
      setError();
    } catch (e) {
      setError(e.response.data.error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getEntry();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Entry</h1>

          {isLoading ? (
            <progress className="progress w-full progress-primary bg-base" />
          ) : null}

          <div className="card bg-base-100 mb-4">
            <div className="card-body sm:w-96 w-full text-left py-4 px-6">
              <h1 className="text-2xs font-thin break-all uppercase">
                #{id}
                <span className="ml-2">
                  {new Date(entry?.created_at).toLocaleDateString("en-GB")}
                </span>
              </h1>

              <div className="grid grid-rows-2 grid-flow-col">
                <div className="col-span-1 row-span-1">
                  <Link to={`/ledger/${entry?.debit?.id}`}>
                    <h1 className="text-xl font-bold break-all capitalize">
                      {entry?.debit?.name || "-"} A/c
                    </h1>
                  </Link>
                </div>
                <div className="col-span-1 mt-1">
                  <Link to={`/ledger/${entry?.credit?.id || ""}`}>
                    <h1 className="text-2lg font-thin break-all capitalize">
                      {entry?.credit?.name || "-"} A/c
                    </h1>
                  </Link>
                </div>
                <div className="col-span-2 row-span-2">
                  <h1 className="text-3xl font-thin break-all text-right mt-2">
                    ₹ {entry?.amount || "0"}
                  </h1>
                </div>
              </div>

              <p className="text-sm break-all text-justify">
                ({entry?.narration})
              </p>

              <div className="form-control mt-2">
                <Link to={`edit`} className="btn btn-primary">
                  Edit
                </Link>
              </div>
            </div>
          </div>

          {error ? (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          ) : null}
        </div>
      </center>
    </div>
  );
}
