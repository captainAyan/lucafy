import { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import ledgerService from "../features/ledger/ledgerService";
import {
  EXPENDITURE,
  ASSET,
  INCOME,
  EQUITY,
  LIABILITY,
} from "../constants/ledgerTypes";
import Loading from "../components/Loading";
import Entry from "../components/Entry";
import Posting from "../components/Posting";

export default function ViewLedger() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const [searchParams] = useSearchParams();

  const [statement, setStatement] = useState({ entries: [] });
  const [entries, setEntries] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [isNegative, setIsNegative] = useState(false); // ledger balance

  const getStatement = async () => {
    setIsLoading(true);
    try {
      const statement = await ledgerService.getStatement(
        id,
        page - 1,
        user.token
      );

      const { total, limit } = statement;
      setTotalPages(Math.ceil(total / limit));
      setStatement(statement);
      setEntries(statement.entries);
      setError();

      /**
       * +ve balance in EXPENDITURE, and ASSET is positive
       * -ve balance in EQUITY, LIABILITY, and INCOME is positive
       * ⚠️unexpected vales will be shown in red color
       */
      if (
        (statement.ledger.type === (EXPENDITURE || ASSET) &&
          statement.balance < 0) ||
        (statement.ledger.type === (INCOME || LIABILITY || EQUITY) &&
          0 < statement.balance)
      ) {
        setIsNegative(true);
      }
    } catch (e) {
      setEntries([]);
      setError(e.response.data.error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getStatement(page);
    navigate(`?page=${page}`);
  }, [page]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Ledger</h1>

          {error ? (
            <>
              {/* Loading is done but there is an error */}
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
            </>
          ) : (
            <div className="card bg-base-100">
              <div className="card-body sm:w-96 w-full text-left py-4 px-6">
                <h1 className="text-2xs font-thin break-all uppercase text-justify">
                  #{id}
                </h1>

                <div className="grid grid-rows-2 grid-flow-col">
                  <div className="col-span-1 row-span-1">
                    <h1 className="text-xl font-bold break-all capitalize">
                      {statement?.ledger?.name || "-"} A/c
                    </h1>
                  </div>
                  <div className="col-span-1 mt-1">
                    <h1 className="text-2lg font-thin break-all capitalize">
                      {statement?.ledger?.type || "-"}
                    </h1>
                  </div>
                  <div className="col-span-2 row-span-2">
                    <h1
                      className={`text-3xl font-thin break-all text-right mt-2 ${
                        isNegative ? "text-red-500" : null
                      }`}
                    >
                      ₹ {Math.abs(statement?.balance) || 0}
                    </h1>
                  </div>
                </div>

                <div className="form-control mt-2">
                  <Link to={`edit`} className="btn btn-primary">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-xl font-bold text-left mb-2 mt-4">Entries</h1>
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

          {/* <div className="w-full max-w-sm sm:mt-4"> */}
          {isLoading ? <Loading width={8} height={8} className="mb-4" /> : null}

          {entries.map((entry) => {
            return (
              <Posting key={entry.id} entry={entry} ledger={statement.ledger} />
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
