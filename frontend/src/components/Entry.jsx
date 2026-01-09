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
    <div className={`bg-white rounded-xl ${className || ""}`}>
      <p className="text-sm break-all uppercase">
        <Link
          to={`/entry/${id}`}
          className="link text-blue-500 font-mono hover:underline"
        >
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
              <h1 className="text-xl font-bold truncate">
                <span className="capitalize">{debit?.name}</span> A/c
              </h1>
            </Link>
          </div>

          <div className="mt-1 w-full">
            <Link to={`/ledger/${credit?._id}`} title={credit?.description}>
              <h1 className="text-2lg truncate">
                To <span className="capitalize">{credit?.name}</span> A/c
              </h1>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl break-all ">
            <Amount amount={amount} />
          </h1>
        </div>
      </div>

      <p className="text-sm break-words text-justify mt-1">({narration})</p>
    </div>
  );
}
