import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Entry from "../components/Entry";
import { GET_ENTRY_URL } from "../constants/api";

export default function Journal() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    getJournal(page);
    navigate(`?page=${page}`);
  }, [page]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    return () => {};
  }, [user, navigate]);

  const getJournal = async (page) => {
    setIsLoading(true);
    const query = new URLSearchParams({ page: page - 1 });

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const response = await axios.get(`${GET_ENTRY_URL}?${query}`, config);
      setEntries(response.data.entries);
      const { limit, total } = response.data;
      setTotalPages(Math.ceil(total / limit));
      setIsLoading(false);
    } catch (e) {
      setEntries([]);
      setIsLoading(false);
    }
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

          {isLoading ? (
            <progress className="progress w-full progress-primary bg-base" />
          ) : null}

          {entries.map((entry) => {
            return <Entry {...entry} key={entry.id} />;
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
