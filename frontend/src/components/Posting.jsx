import { Link } from "react-router-dom";

export default function Posting(props) {
  const { id, account, amount, isNegative, narration } = props;
  const time = new Date().toLocaleDateString("en-GB");

  return (
    <div className="card w-full max-w-sm bg-base-100 mb-4">
      <div className="card-body sm:w-96 w-full text-left py-4 px-6">
        <h1 className="text-2xs font-thin break-all capitalize">
          <Link to={`/entry/${id}`} className="link text-blue-500">
            #{id}
          </Link>
          <span className="ml-2 mr-2">{time}</span>
          &middot;
          <span
            className={`ml-2 break-all capitalize ${
              isNegative ? "text-red-500" : ""
            }`}
          >
            {account} A/c
          </span>
        </h1>

        <div className="grid grid-rows-1 grid-flow-col">
          <div className="col-span-1 row-span-1">
            <p className="text-sm break-all text-justify">{narration}</p>
          </div>
          <div className="col-span-2 row-span-1">
            <h1 className={`text-sm font-bold break-all text-right `}>
              ₹ {amount}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
