import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import balanceIsNegative from "../util/balanceIsNegative";
import { useLedgerStatementDataHook } from "../hooks/useLedgerDataHook";
import Time from "../components/Time";
import Amount from "../components/Amount";
import { EntryTable, EntryTableRow } from "../components/EntryTable";

export default function ViewLedger() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const [statement, setStatement] = useState();

  useEffect(() => {
    navigate(`?page=${page}`);
  }, [navigate, page]);

  const {
    data: fetchedData,
    isLoading: isFetching,
    isError: isFetchingError,
    error: fetchingError,
  } = useLedgerStatementDataHook(token, id, page - 1);

  useEffect(() => {
    setStatement(fetchedData?.data);
  }, [fetchedData]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Ledger</h1>

      <div className="bg-white rounded-xl">
        {/* Loading view */}
        {isFetching && <h1 className="text-xl text-center py-8">Loading...</h1>}
        {/* Error view */}
        {isFetchingError && (
          <div className="text-red-500">
            <h1 className="text-4xl text-center pt-8">😢</h1>
            <h1 className="text-xl text-center pt-4 pb-2">
              There was an error.
            </h1>
            <p className="text-sm text-center pb-8">
              {fetchingError?.response?.data?.error?.message}
            </p>
          </div>
        )}

        {/* Ledger account overview */}
        {fetchedData && !isFetching && (
          <div className="bg-white rounded-xl px-6 py-4 flex flex-col mb-2">
            <p className="text-xs font-thin break-all uppercase">
              <span>#{id}</span>
              <span className="ml-2">
                <Time time={statement?.ledger?.created_at} />
              </span>
            </p>

            <div className="flex flex-row justify-between w-full mt-1">
              <div className="flex flex-col">
                <div>
                  <h1 className="text-xl font-bold truncate">
                    <span className="capitalize">
                      {statement?.ledger?.name}
                    </span>{" "}
                    A/c
                  </h1>
                </div>

                <div className="mt-1 w-full">
                  <h1 className="text-2lg font-thin truncate capitalize">
                    {statement?.ledger?.type}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-thin break-all ">
                  <Amount amount={statement?.balance} />
                </h1>
              </div>
            </div>

            <p className="text-sm break-words text-justify mt-1">
              ({statement?.ledger?.description})
            </p>
          </div>
        )}

        <EntryTable>
          {statement?.entries?.map((entry) => {
            return <EntryTableRow {...entry} key={entry.id} />;
          })}
        </EntryTable>
        {isFetching && <h1 className="text-xl text-center py-8">Loading...</h1>}
        {statement?.entries?.length === 0 && (
          <h1 className="text-xl text-center py-8">No entries</h1>
        )}
      </div>
    </>
  );
}
