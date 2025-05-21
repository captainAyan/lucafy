import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AddIcon from "@mui/icons-material/Add";

import Entry from "../components/Entry";
import useMicroStatementDate from "../hooks/useMicroStatementData";
import { useJournalDataHook } from "../hooks/useEntryDataHook";
import { amountFormatLong, amountFormatShort } from "../util/amountFormat";
import ActivityHeatMap from "../components/ActivityHeatMap";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, token } = useSelector((state) => state.auth);
  const { amountFormat, currency } = useSelector((state) => state.preference);

  const [statement, setStatement] = useState({});
  const { data: microstatementData } = useMicroStatementDate(token);

  const [entries, setEntries] = useState({});
  const { data: entriesData } = useJournalDataHook(token, 0, "newest", 4, "");

  useEffect(() => {
    setStatement(microstatementData?.data);
  }, [microstatementData]);

  useEffect(() => {
    setEntries(entriesData?.data);
  }, [entriesData]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="bg-blue-100 border border-blue-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-blue-900 max-w-xs truncate">
            Welcome
            <br />
            <strong>{user?.firstName || "-"}</strong>
          </h2>
          <span className="inline-block mt-8 px-6 py-2 rounded-full text-md text-white bg-blue-700">
            👑 Premium
          </span>
        </div>

        <div className="bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-indigo-900">
            {entries?.total == 1 ? "Entry" : "Entries"}
            <br />
            <strong>{entries?.total || "-"}</strong>
          </h2>
          <Link to="/entry">
            <Button className="!rounded-full h-10 ps-4 pe-6 mt-8">
              <AddIcon className="me-1" />
              Create Entry
            </Button>
          </Link>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Stats</h3>

      <section className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          title="Total Income"
          subtitle="Extra Info TBA"
          amount={statement?.income}
          amountFormat={amountFormat}
          currency={currency}
          trend={1}
          icon={<TrendingUpIcon />}
        />

        <StatCard
          title="Net Income"
          subtitle="Extra Info TBA"
          amount={statement?.income - statement?.expenditure}
          amountFormat={amountFormat}
          currency={currency}
          trend={-1}
          icon={<TrendingDownIcon />}
        />

        <StatCard
          title="Total Assets"
          subtitle="Extra Info TBA"
          amount={statement?.asset}
          amountFormat={amountFormat}
          currency={currency}
          trend={-1}
          icon={<TrendingDownIcon />}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl col-span-2">
          <div className="px-6 pt-6 pb-4 space-y-2">
            <div className="text-sm font-medium text-gray-500">Activity</div>
          </div>
          <div className="pr-8 pl-4">
            <ActivityHeatMap />
          </div>
        </div>
      </section>

      <h3 className="text-2xl font-bold mb-4">Latest Entries</h3>
      {/* Empty view */}
      {entries?.entries?.length === 0 && (
        <div className="w-full bg-white rounded-xl pb-4">
          <h1 className="text-xl text-center py-8">No entries</h1>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {entries?.entries?.map((entry) => {
          return <Entry className="w-full p-4" key={entry.id} {...entry} />;
        })}
      </div>
    </>
  );
}

function StatCard({
  title,
  subtitle,
  icon,
  amount,
  amountFormat,
  currency,
  trend,
}) {
  return (
    <div className="p-6 bg-white rounded-2xl">
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-500">{title}</div>

        <div
          className="text-5xl font-light md:text-6xl"
          title={amountFormatLong(amount || 0, amountFormat, currency)}
        >
          {amountFormatShort(amount || 0, amountFormat, currency)}
        </div>

        <div
          className={`flex items-center space-x-1 text-sm font-medium ${
            trend > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          <span>{subtitle}</span>
          <div className="h-6">{icon}</div>
        </div>
      </div>
    </div>
  );
}
