import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "../components/Loading";
import entryService from "../features/entry/entryService";
import timeFormat from "../util/timeFormat";
import amountFormat from "../util/amountFormat";
import Alert from "../components/Alert";

export default function ViewEntry() {
  const { token } = useSelector((state) => state.auth2);
  const { amountFormat: currencyFormat, currency } = useSelector(
    (state) => state.preference
  );
  const { id } = useParams();

  const [entry, setEntry] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const getEntry = async () => {
    try {
      const e = await entryService.getById(id, token);

      setEntry({
        ...e,
        debit: e.debit_ledger,
        credit: e.credit_ledger,
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

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Entry</h1>

          {isLoading ? (
            <div className="mb-4">
              <Loading />
            </div>
          ) : error ? (
            <Alert type="error" message={error} />
          ) : (
            <>
              {/* Loading is done and there isn't any errors */}
              <div className="card bg-base-100 mb-4">
                <div className="card-body sm:w-96 w-full text-left py-4 px-6">
                  <h1 className="text-2xs font-thin break-all uppercase">
                    #{id}
                    <span className="ml-2">
                      {timeFormat(entry?.created_at)}
                    </span>
                  </h1>

                  <div className="grid grid-rows-2 grid-flow-col">
                    <div className="col-span-1 row-span-1">
                      <Link to={`/ledger/${entry?.debit?.id}`}>
                        <h1 className="text-xl font-bold capitalize line-clamp-1">
                          {entry?.debit?.name || "-"} A/c
                        </h1>
                      </Link>
                    </div>
                    <div className="col-span-1 mt-1">
                      <Link to={`/ledger/${entry?.credit?.id || ""}`}>
                        <h1 className="text-2lg font-thin capitalize line-clamp-1">
                          {entry?.credit?.name || "-"} A/c
                        </h1>
                      </Link>
                    </div>
                    <div className="col-span-2 row-span-2">
                      <h1 className="text-3xl font-thin break-all text-right mt-2">
                        {amountFormat(
                          entry?.amount || 0,
                          currencyFormat,
                          currency
                        )}
                      </h1>
                    </div>
                  </div>

                  <p className="text-sm break-words text-justify">
                    ({entry?.narration})
                  </p>

                  <div className="form-control mt-2">
                    <Link to={`edit`} className="btn btn-primary">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </center>
    </div>
  );
}
