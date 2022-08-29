import { Link, useParams } from "react-router-dom";
import Posting from "../components/Posting";

export default function ViewLedger() {
  const { id } = useParams();

  return (
    <div className="p-4 min-h-screen">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Ledger</h1>
        </div>

        <div className="card w-full max-w-sm bg-base-100 mb-4">
          <div className="card-body sm:w-96 w-full text-left py-4 px-6">
            <h1 className="text-2xs font-thin break-all capitalize text-justify">
              #{id}
            </h1>

            <div className="grid grid-rows-2 grid-flow-col">
              <div className="col-span-1 row-span-1">
                <h1 className="text-xl font-bold break-all capitalize">
                  Cash A/c
                </h1>
              </div>
              <div className="col-span-1 mt-1">
                <h1 className="text-2lg font-thin break-all capitalize">
                  Asset
                </h1>
              </div>
              <div className="col-span-2 row-span-2">
                <h1 className="text-3xl font-thin break-all text-right mt-2">
                  ₹ 800.00
                </h1>
              </div>
            </div>

            <div className="form-control mt-2">
              <Link to={`edit`} className="btn btn-primary">
                Edit
              </Link>
            </div>
          </div>
        </div>
        <Posting
          _id="1"
          account="Expenses"
          amount="200.00"
          isNegative={true}
          narration="this is a test narration"
        />
        <Posting
          _id="2"
          account="Salary"
          amount="1,000.00"
          isNegative={false}
          narration="this is a test narration"
        />
        <Posting
          _id="3"
          account="Expenses"
          amount="200.00"
          isNegative={true}
          narration="this is a test narration"
        />
        <Posting
          _id="4"
          account="Salary"
          amount="1,000.00"
          isNegative={false}
          narration="this is a test narration"
        />
        <Posting
          _id="5"
          account="Expenses"
          amount="200.00"
          isNegative={true}
          narration="this is a test narration"
        />
        <Posting
          _id="6"
          account="Salary"
          amount="1,000.00"
          isNegative={false}
          narration="this is a test narration"
        />
        <Posting
          _id="7"
          account="Expenses"
          amount="200.00"
          isNegative={true}
          narration="this is a test narration"
        />
        <Posting
          _id="8"
          account="Salary"
          amount="1,000.00"
          isNegative={false}
          narration="this is a test narration"
        />
        <Posting
          _id="9"
          account="Expenses"
          amount="200.00"
          isNegative={true}
          narration="this is a test narration"
        />
        <Posting
          _id="10"
          account="Salary"
          amount="1,000.00"
          isNegative={false}
          narration="this is a test narration"
        />

        <div className="btn-group w-full max-w-sm">
          <button className="btn">«</button>
          <button className="btn">Page 22</button>
          <button className="btn">»</button>
        </div>
      </center>
    </div>
  );
}
