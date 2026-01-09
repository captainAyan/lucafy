import { Link } from "react-router-dom";
import amountFormat from "../util/amountFormat";
import timeFormat from "../util/timeFormat";

export default function Posting(props) {
  const { entry, ledger, currencyFormat, currencySymbol } = props;

  const account =
    entry.debit_ledger.id === ledger.id
      ? entry.credit_ledger
      : entry.debit_ledger;

  const time = timeFormat(entry.created_at);
  const amount = amountFormat(entry.amount, currencyFormat, currencySymbol);

  const toOrBy = entry.debit_ledger.id === ledger.id ? "To" : "By";

  return (
    <div className="card w-full max-w-sm bg-base-100 mb-4">
      <div className="card-body sm:w-96 w-full text-left py-4 px-6">
        <h1 className="text-2xs font-thin break-all uppercase">
          <Link to={`/entry/${entry.id}`} className="link text-blue-500">
            #{entry.id}
          </Link>
          <span className="ml-2">{time}</span>
        </h1>

        <div className="grid grid-rows-1 grid-flow-col">
          <div className="col-span-1 row-span-1">
            <h1 className="text-lg font-normal line-clamp-1">
              <span className="font-bold">{toOrBy}</span> &middot;{" "}
              <span className="capitalize">{account.name}</span> A/c
            </h1>
          </div>
          <div className="col-span-2 row-span-1">
            <h1 className={`text-lg font-bold break-all text-right `}>
              {amount}
            </h1>
          </div>
        </div>
        <p className="text-sm break-words text-justify">({entry.narration})</p>
      </div>
    </div>
  );
}
