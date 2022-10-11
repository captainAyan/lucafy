import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import Entry from "../components/Entry";
import Loading from "../components/Loading";
import entryService from "../features/entry/entryService";

export default function Journal() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { amountFormat, currency } = useSelector((state) => state.preference);

  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getJournal(page);
      navigate(`?page=${page}`);
    }
  }, [user, navigate, page]);

  const getJournal = async (page) => {
    setIsLoading(true);
    setEntries([]);

    try {
      const data = await entryService.getJournal(page - 1, user?.token);
      const { total, limit } = data;

      setEntries(data.entries);
      setTotalPages(Math.ceil(total / limit));
    } catch (e) {
      setEntries([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-2">Journal</h1>
          <p className="text-sm text-left mb-4">
            Page <span>{page}</span> of <span>{totalPages}</span>
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

          {entries.map((entry) => {
            return (
              <Entry
                {...entry}
                key={entry.id}
                currencyFormat={amountFormat}
                currencySymbol={currency}
              />
            );
          })}

          {!isLoading && entries.length === 0 ? (
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
