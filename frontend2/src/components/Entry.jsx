import { Link } from "react-router-dom";
import Amount from "../components/Amount";
import Time from "./Time";

export default function Entry({
  id,
  debit_ledger: debit,
  credit_ledger: credit,
  amount,
  narration,
  created_at,
  className,
}) {
  return (
    <div
      className={`w-full bg-white rounded-xl px-6 py-4 flex flex-col ${className}`}
    >
      <p className="text-xs font-thin break-all uppercase">
        <Link to={`/entry/${id}`} className="link text-blue-500">
          <span>#{id}</span>
        </Link>
        <span className="ml-2">
          <Time time={created_at} />
        </span>
      </p>

      <div className="flex flex-row justify-between w-full mt-1">
        <div className="flex flex-col">
          <div>
            <Link to={`/ledger/${debit?._id}`} title={debit?.description}>
              <h1 className="text-xl font-bold capitalize truncate">
                {debit?.name} A/c
              </h1>
            </Link>
          </div>

          <div className="mt-1 w-full">
            <Link to={`/ledger/${credit?._id}`} title={credit?.description}>
              <h1 className="text-2lg font-thin capitalize truncate">
                {credit?.name} A/c
              </h1>
            </Link>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-thin break-all py-3">
            <Amount amount={amount} />
          </h1>
        </div>
      </div>

      <p className="text-sm break-words text-justify mt-1">({narration})</p>
    </div>
  );
}
