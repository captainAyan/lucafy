import { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "../components/Loading";
import Posting from "../components/Posting";
import amountFormat from "../util/amountFormat";
import Alert from "../components/Alert";
import balanceIsNegative from "../util/balanceIsNegative";
import { useLedgerStatementDataHook } from "../hooks/useLedgerDataHook";

export default function ViewLedger() {
  const { token } = useSelector((state) => state.auth);
  const { amountFormat: currencyFormat, currency } = useSelector(
    (state) => state.preference
  );
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const [statement, setStatement] = useState();

  useEffect(() => {
    navigate(`?page=${page}`);
  }, [navigate, page]);

  const { data, isLoading, isError, error } = useLedgerStatementDataHook(
    token,
    id,
    page - 1
  );

  useEffect(() => {
    setStatement(data?.data);
  }, [data]);

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Ledger</h1>

          {isError ? (
            <Alert message={error?.response?.data?.error?.message} />
          ) : (
            <div className="card bg-base-100">
              <div className="card-body sm:w-96 w-full text-left py-4 px-6">
                <h1 className="text-2xs font-thin break-all uppercase text-justify">
                  #{id}
                </h1>

                <div className="grid grid-rows-2 grid-flow-col">
                  <div className="col-span-1 row-span-1">
                    <h1 className="text-xl font-bold capitalize line-clamp-1">
                      {statement?.ledger?.name || "-"} A/c
                    </h1>
                  </div>
                  <div className="col-span-1 mt-1">
                    <h1 className="text-2lg font-thin capitalize">
                      {statement?.ledger?.type || "-"}
                    </h1>
                  </div>
                  <div className="col-span-2 row-span-2">
                    <h1
                      className={`text-3xl font-thin break-all text-right mt-2 ${
                        balanceIsNegative(
                          statement?.ledger?.type,
                          statement?.balance
                        )
                          ? "text-red-500"
                          : null
                      }`}
                    >
                      {amountFormat(
                        statement?.balance || 0,
                        currencyFormat,
                        currency
                      )}
                    </h1>
                  </div>
                </div>

                <p className="text-sm break-words text-justify">
                  ({statement?.ledger?.description})
                </p>

                <div className="form-control mt-2">
                  <Link to={`edit`} className="btn btn-primary">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm mt-4 text-justify">
            * If the entries don't add up to the shown ledger balance, look up
            the normalization feature.
          </p>

          <h1 className="text-xl font-bold text-left mb-2 mt-4">Entries</h1>
          <p className="text-sm text-left mb-4">
            Page <span>{page}</span> of{" "}
            <span>{Math.ceil(statement?.total / statement?.limit) || 0}</span>
          </p>

          <div className="btn-group w-full max-w-sm mb-4">
            <button className="btn" onClick={() => setPage(page - 1)}>
              «
            </button>
            <button className="btn">Page {page}</button>
            <button className="btn" onClick={() => setPage(page + 1)}>
              »
            </button>
          </div>

          <div className="mb-4">{isLoading ? <Loading /> : null}</div>

          {statement?.entries?.map((entry) => (
            <Posting
              key={entry.id}
              entry={entry}
              ledger={statement.ledger}
              currencyFormat={currencyFormat}
              currencySymbol={currency}
            />
          ))}

          {!isLoading && statement?.entries?.length === 0 ? (
            <h1 className="text-2xl font-thin text-left mb-4">No Data</h1>
          ) : null}

          <div className="btn-group w-full max-w-sm">
            <button className="btn" onClick={() => setPage(page - 1)}>
              «
            </button>
            <button className="btn">Page {page}</button>
            <button className="btn" onClick={() => setPage(page + 1)}>
              »
            </button>
          </div>
        </div>
      </center>
    </div>
  );
}
