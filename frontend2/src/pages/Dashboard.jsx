import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Entry from "../components/Entry";
import useMicroStatementDate from "../hooks/useMicroStatementData";
import { useJournalDataHook } from "../hooks/useEntryDataHook";
import { amountFormatLong, amountFormatShort } from "../util/amountFormat";
import ActivityHeatMap from "../components/ActivityHeatMap";

export default function Dashboard() {
  const { user, token } = useSelector((state) => state.auth);
  const { amountFormat, currency } = useSelector((state) => state.preference);

  const [statement, setStatement] = useState({});
  const { data: microstatementData } = useMicroStatementDate(token);

  const [entries, setEntries] = useState({});
  const { data: entriesData } = useJournalDataHook(token, 0, "newest", 10, "");

  useEffect(() => {
    setStatement(microstatementData?.data);

    if (entriesData) {
      const firstThreeEntries = entriesData?.entries?.splice(0, 3);

      entriesData.entries = firstThreeEntries;
      setEntries(entriesData?.data);
    }
  }, [microstatementData, entriesData]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 bg-blue-100 border border-blue-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-blue-900 max-w-xs truncate">
            Welcome
            <br />
            <strong>{user?.firstName}</strong>
          </h2>
          <span className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-blue-700">
            👑 Premium
          </span>
        </div>

        <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-indigo-900">
            {entries?.total == 1 ? "Entry" : "Entries"}
            <br />
            <strong>{entries?.total}</strong>
          </h2>
          <a
            href="#"
            className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-indigo-600 hover:bg-indigo-800"
          >
            Create Entry
          </a>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto w-full mb-6">
        <div className="p-6 bg-white rounded-2xl">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">
              Total Income
            </div>

            <div
              className="text-5xl font-light md:text-6xl"
              title={amountFormatLong(
                statement?.income || 0,
                amountFormat,
                currency
              )}
            >
              {amountFormatShort(
                statement?.income || 0,
                amountFormat,
                currency
              )}
            </div>

            <div className="flex items-center space-x-1 text-sm font-medium text-green-500">
              <span>32k increase</span>

              <svg
                className="w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17.25 15.25V6.75H8.75"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 7L6.75 17.25"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Net Income</div>

            <div
              className="text-5xl font-light md:text-6xl"
              title={amountFormatLong(
                statement?.income - statement?.expenditure || 0,
                amountFormat,
                currency
              )}
            >
              {amountFormatShort(
                statement?.income - statement?.expenditure || 0,
                amountFormat,
                currency
              )}
            </div>

            <div className="flex items-center space-x-1 text-sm font-medium text-red-500">
              <span>7% increase</span>

              <svg
                className="w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17.25 8.75V17.25H8.75"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 17L6.75 6.75"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Total Asset</div>

            <div
              className="text-5xl font-light md:text-6xl"
              title={amountFormatLong(
                statement?.asset || 0,
                amountFormat,
                currency
              )}
            >
              {amountFormatShort(statement?.asset || 0, amountFormat, currency)}
            </div>

            <div className="flex items-center space-x-1 text-sm font-medium text-green-500">
              <span>3% increase</span>

              <svg
                className="w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17.25 15.25V6.75H8.75"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 7L6.75 17.25"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto w-full mb-6">
        <div className="bg-white rounded-2xl col-span-2">
          <div className="px-6 pt-6 pb-4 space-y-2">
            <div className="text-sm font-medium text-gray-500">Activity</div>
          </div>
          <div className="pr-8 pl-4">
            <ActivityHeatMap />
          </div>
        </div>
      </section>

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">Latest Entries</h3>
        {entries?.entries?.map((entry) => {
          return (
            <Entry
              className="mb-4"
              key={entry.id}
              {...entry}
              currencyFormat={amountFormat}
              currencySymbol={currency}
            />
          );
        })}
      </div>
    </>
  );
}
