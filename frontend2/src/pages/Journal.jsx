import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Formik, Form, Field } from "formik";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { useJournalDataHook } from "../hooks/useEntryDataHook";
import { EntryTable, EntryTableRow } from "../components/EntryTable";
import Button from "../components/Button";

export default function Journal() {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [filter, setFilter] = useState({
    keyword: searchParams.get("keyword") || "",
    order: searchParams.get("order") || "newest",
    limit: parseInt(searchParams.get("limit")) || 10,
  });

  useEffect(() => {
    const query = new URLSearchParams({ page, ...filter });
    navigate(`/journal?${query}`, { replace: true });
  }, [page, filter, navigate]);

  const { data, isLoading, isError } = useJournalDataHook(
    token,
    page - 1,
    filter.order,
    filter.limit,
    filter.keyword
  );

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Journal</h1>

      <div className="bg-white rounded-xl mb-4">
        <Formik
          initialValues={filter}
          onSubmit={(values) => {
            setFilter(values);
            setPage(1);
          }}
        >
          <Form>
            <div className="p-4 flex">
              <div className="flex items-center h-12">
                <div className="h-full relative w-56 border-1 border-gray-300 rounded-lg">
                  <label htmlFor="keyword" className="sr-only">
                    Search
                  </label>
                  <Field
                    type="text"
                    name="keyword"
                    className="h-full py-1.5 sm:py-2 px-3 ps-10 block w-full border-gray-300 shadow-xs rounded-lg sm:text-sm focus:outline-none focus:ring-4 ring-indigo-200 duration-300"
                    placeholder="Search for entries"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <SearchOutlinedIcon
                      fontSize="small"
                      className="text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center h-12 ms-6">
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
                  className="h-full"
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
          {data?.data?.entries?.map((entry) => {
            return <EntryTableRow {...entry} key={entry.id} />;
          })}
        </EntryTable>
        {isLoading && <h1 className="text-xl text-center py-8">Loading...</h1>}
        {data?.data?.entries?.length === 0 && (
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
