import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import ReactPaginate from "react-paginate";

import balanceIsNegative from "../util/balanceIsNegative";
import { useLedgerStatementDataHook } from "../hooks/useLedgerDataHook";
import Time from "../components/Time";
import Amount from "../components/Amount";
import { EntryTable, EntryTableRow } from "../components/EntryTable";
import Button from "../components/Button";

export default function ViewLedger() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const [statement, setStatement] = useState();

  const [filter, setFilter] = useState({
    order: searchParams.get("order") || "newest",
    limit: parseInt(searchParams.get("limit")) || 10,
  });

  useEffect(() => {
    const query = new URLSearchParams({ page, ...filter });
    navigate(`/ledger/${id}?${query}`, { replace: true });
  }, [page, filter, navigate, id]);

  const { data, isLoading, isError, error } = useLedgerStatementDataHook(
    token,
    id,
    page - 1,
    filter.order,
    filter.limit
  );

  useEffect(() => {
    setStatement(data?.data);
  }, [data]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Ledger</h1>

      <div className="bg-white rounded-xl">
        {/* Loading view */}
        {isLoading && <h1 className="text-xl text-center py-8">Loading...</h1>}
        {/* Error view */}
        {isError && (
          <div className="text-red-500">
            <h1 className="text-4xl text-center pt-8">😢</h1>
            <h1 className="text-xl text-center pt-4 pb-2">
              There was an error.
            </h1>
            <p className="text-sm text-center pb-8">
              {error?.response?.data?.error?.message}
            </p>
          </div>
        )}

        {/* Ledger account overview */}
        {data && !isLoading && (
          <div className="bg-white rounded-xl p-4 flex flex-col">
            <p className="text-sm font-thin break-all uppercase">
              <span className="font-mono">#{id}</span>
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
                <h1
                  className={`text-3xl font-thin break-all ${
                    balanceIsNegative(
                      statement?.ledger?.type,
                      statement?.balance
                    )
                      ? "text-red-500"
                      : null
                  }`}
                >
                  <Amount amount={statement?.balance} />
                </h1>
              </div>
            </div>

            <p className="text-sm break-words text-justify mt-1">
              ({statement?.ledger?.description})
            </p>
          </div>
        )}

        <Formik
          initialValues={filter}
          onSubmit={(values) => {
            setFilter(values);
            setPage(1);
          }}
        >
          <Form>
            <div className="px-4 pb-4 flex">
              <div className="flex items-center h-12">
                <label
                  htmlFor="order"
                  className="text-sm font-medium text-gray-700"
                >
                  Order
                </label>
                <Field
                  as="select"
                  name="order"
                  className="h-full ms-2 px-2 border border-gray-300 rounded-lg shadow-xs focus:outline-none focus:ring-4 ring-indigo-200 text-sm hover:cursor-pointer duration-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </Field>
              </div>

              <div className="flex items-center h-12 ms-6">
                <label
                  htmlFor="limit"
                  className="text-sm font-medium text-gray-700"
                >
                  Limit
                </label>
                <Field
                  as="select"
                  name="limit"
                  className="h-full ms-2 px-2 border border-gray-300 rounded-lg shadow-xs focus:outline-none focus:ring-4 ring-indigo-200 text-sm hover:cursor-pointer duration-300"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </Field>
              </div>

              <div className="flex items-center h-12 ms-6">
                <Button
                  type="submit"
                  className="h-full px-4"
                  variant="secondary"
                  isLoading={isLoading}
                >
                  Search
                </Button>
              </div>
            </div>
          </Form>
        </Formik>

        <div className="flex justify-between px-4 pb-4">
          <div className="flex items-center justify-center">
            <p className="text-sm">
              Page <span>{page}</span> of{" "}
              <span>
                {Math.ceil(data?.data?.total / data?.data?.limit) || 0}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-sm">
              {data?.data?.entries?.length !== 0 && !isError && (
                <>
                  {/* 1 - 10 of 99 */}
                  {data?.data?.skip + 1 || ""}
                  <span> - </span>
                  {data?.data?.skip + 1 + data?.data?.limit > data?.data?.total
                    ? data?.data?.total || ""
                    : data?.data?.skip + data?.data?.limit || ""}
                  <span> of </span>
                  {data?.data?.total || ""}
                </>
              )}
            </p>
          </div>
        </div>

        <EntryTable>
          {statement?.entries?.map((entry) => {
            return <EntryTableRow {...entry} key={entry.id} />;
          })}
        </EntryTable>
        {isLoading && <h1 className="text-xl text-center py-8">Loading...</h1>}
        {statement?.entries?.length === 0 && (
          <h1 className="text-xl text-center py-8">No entries</h1>
        )}

        <div className="py-1 px-4 my-2">
          <ReactPaginate
            previousLabel={"«"}
            nextLabel={"»"}
            breakLabel={"..."}
            pageCount={Math.ceil(data?.data?.total / data?.data?.limit) || 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={(i) => setPage(i.selected + 1)}
            forcePage={page - 1}
            containerClassName="flex items-center space-x-1"
            activeLinkClassName="bg-indigo-200 hover:bg-indigo-200"
            pageLinkClassName="min-w-10 flex justify-center items-center text-gray-800 cursor-pointer hover:bg-gray-100 focus:outline-hidden py-2.5 text-sm rounded-full"
            previousLinkClassName="min-w-10 flex justify-center items-center text-gray-800 cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none"
            nextLinkClassName="min-w-10 flex justify-center items-center text-gray-800 cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>
      </div>
    </>
  );
}
