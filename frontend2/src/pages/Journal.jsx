import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Formik, Form, Field } from "formik";

// import Loading from "../components/Loading";
import { useJournalDataHook } from "../hooks/useEntryDataHook";
import { EntryTable, EntryTableRow } from "../components/EntryTable";

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

  const { data, isLoading } = useJournalDataHook(
    token,
    page - 1,
    filter.order,
    filter.limit,
    filter.keyword
  );

  return (
    <div className="b-6">
      <h1 className="text-4xl font-bold text-left mb-2">Journal</h1>
      <p className="text-sm text-left mb-4">
        Page <span>{page}</span> of{" "}
        <span>{Math.ceil(data?.data?.total / data?.data?.limit) || 0}</span>
      </p>

      <div className="flex flex-col bg-white rounded-xl mb-4">
        <div className="min-w-full inline-block align-middle">
          <div className="divide-y divide-gray-200">
            <Formik
              initialValues={filter}
              onSubmit={(values) => setFilter(values)}
            >
              <Form>
                <div className="py-4 px-4 flex">
                  <div className="relative w-56 border-1 border-gray-300 rounded-lg">
                    <label htmlFor="keyword" className="sr-only">
                      Search
                    </label>
                    <Field
                      // value={keyword}
                      // onChange={(e) => setKeyword(e.target.value)}
                      type="text"
                      name="keyword"
                      className="py-1.5 sm:py-2 px-3 ps-9 block w-full border-gray-200 shadow-xs rounded-lg sm:text-sm focus:outline-none focus:ring-4 ring-indigo-200"
                      placeholder="Search for entries"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                      <svg
                        className="size-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center ms-6">
                    <label
                      htmlFor="order"
                      className="text-sm font-medium text-gray-700"
                    >
                      Order
                    </label>
                    <Field
                      as="select"
                      // value={order}
                      // onChange={(e) => setOrder(e.target.value)}
                      name="order"
                      className="h-full ms-2 px-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-4 ring-indigo-200 text-sm hover:cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </Field>
                  </div>

                  <div className="flex items-center ms-6">
                    <label
                      htmlFor="limit"
                      className="text-sm font-medium text-gray-700"
                    >
                      Limit
                    </label>
                    <Field
                      as="select"
                      // value={limit}
                      // onChange={(e) => setLimit(e.target.value)}
                      name="limit"
                      className="h-full ms-2 px-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-4 ring-indigo-200 text-sm hover:cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </Field>
                  </div>

                  <div className="flex items-center ms-6">
                    <button
                      type="submit"
                      className="h-full px-6 bg-indigo-500 text-white rounded-md focus:outline-none focus:ring-4 ring-indigo-200 text-md hover:bg-indigo-600 hover:cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </Form>
            </Formik>
            <EntryTable>
              {data?.data?.entries?.map((entry) => {
                return <EntryTableRow {...entry} key={entry.id} />;
              })}
            </EntryTable>
            {isLoading && (
              <h1 className="text-xl text-center py-8">Loading...</h1>
            )}

            <div className="py-1 px-4 my-2">
              <ReactPaginate
                previousLabel={"«"}
                nextLabel={"»"}
                breakLabel={"..."}
                pageCount={
                  Math.ceil(data?.data?.total / data?.data?.limit) || 0
                }
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
        </div>
      </div>
    </div>
  );
}
