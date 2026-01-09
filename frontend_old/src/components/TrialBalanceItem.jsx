import { Link } from "react-router-dom";
import amountFormat from "../util/amountFormat";
import balanceIsNegative from "../util/balanceIsNegative";

export default function TrialBalanceItem(props) {
  const { ledger, balance, currencyFormat, currencySymbol } = props;

  const isNegative = balanceIsNegative(ledger.type, balance); // ledger balance
  const amount = amountFormat(balance, currencyFormat, currencySymbol);

  return (
    <div className="card bg-base-100 mb-4">
      <div className="card-body sm:w-96 w-full text-left py-4 px-6">
        <h1 className="text-2xs font-thin break-all uppercase">
          <Link to={`/ledger/${ledger.id}`} className="link text-blue-500">
            #{ledger.id}
          </Link>
        </h1>

        <div className="grid grid-rows-2 grid-flow-col">
          <div className="col-span-1 row-span-1">
            <h1 className="text-xl font-bold capitalize line-clamp-1">
              {ledger.name} A/c
            </h1>
          </div>
          <div className="col-span-1 mt-1">
            <h1 className="text-2lg font-thin capitalize">{ledger.type}</h1>
          </div>
          <div className="col-span-2 row-span-2">
            <h1
              className={`text-3xl font-thin break-all text-right mt-2 ${
                isNegative ? "text-red-500" : null
              }`}
            >
              {amount}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
