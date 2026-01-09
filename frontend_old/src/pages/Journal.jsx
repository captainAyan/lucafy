import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import Entry from "../components/Entry";
import Loading from "../components/Loading";
import { useJournalDataHook } from "../hooks/useEntryDataHook";

export default function Journal() {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { amountFormat, currency } = useSelector((state) => state.preference);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    navigate(`?page=${page}`);
  }, [navigate, page]);

  const { data, isLoading } = useJournalDataHook(token, page - 1);

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-2">Journal</h1>
          <p className="text-sm text-left mb-4">
            Page <span>{page}</span> of{" "}
            <span>{Math.ceil(data?.data?.total / data?.data?.limit) || 0}</span>
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

          {data?.data?.entries?.map((entry) => {
            return (
              <Entry
                {...entry}
                key={entry.id}
                currencyFormat={amountFormat}
                currencySymbol={currency}
              />
            );
          })}

          {!isLoading && data?.data?.entries?.length === 0 ? (
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
