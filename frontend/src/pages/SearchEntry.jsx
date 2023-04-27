import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import Entry from "../components/Entry";
import Loading from "../components/Loading";
import { useSearchDataHook } from "../hooks/useEntryDataHook";
import useDebounce from "../hooks/useDebounce";

export default function SearchEntry() {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { amountFormat, currency } = useSelector((state) => state.preference);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const [keyword, setKeyword] = useState("");
  const debouncedSearchKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    navigate(`?${new URLSearchParams({ page, search: keyword }).toString()}`);
  }, [navigate, page, keyword]);

  const { data, isLoading, refetch } = useSearchDataHook(
    token,
    debouncedSearchKeyword,
    page - 1
  );

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-2">Search Entry</h1>

          <div className="form-control mb-2">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search…"
                className="input input-bordered w-full"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
              />
              <button className="btn btn-square" onClick={() => refetch()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

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
