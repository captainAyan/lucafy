import { Link, useParams } from "react-router-dom";

export default function ViewEntry() {
  const { id } = useParams();

  const debit = { _id: "4", name: "expenses" };
  const credit = { _id: "1", name: "cash" };
  const time = new Date().toLocaleDateString("en-GB");

  return (
    <>
      <div className="w-full max-w-sm sm:mt-4">
        <h1 className="text-4xl font-bold text-left mb-8">Entry</h1>
      </div>

      <div className="card w-full max-w-sm bg-base-100 mb-4">
        <div className="card-body sm:w-96 w-full text-left py-4 px-6">
          <h1 className="text-2xs font-thin break-all capitalize">
            #{id}
            <span className="ml-2">{time}</span>
          </h1>

          <div className="grid grid-rows-2 grid-flow-col">
            <div className="col-span-1 row-span-1">
              <Link to={`/ledger/${debit._id}`}>
                <h1 className="text-xl font-bold break-all capitalize">
                  {debit.name} A/c
                </h1>
              </Link>
            </div>
            <div className="col-span-1 mt-1">
              <Link to={`/ledger/${credit._id}`}>
                <h1 className="text-2lg font-thin break-all capitalize">
                  {credit.name} A/c
                </h1>
              </Link>
            </div>
            <div className="col-span-2 row-span-2">
              <h1 className="text-3xl font-thin break-all text-right mt-2">
                ₹ 100.00
              </h1>
            </div>
          </div>

          <p className="text-sm break-all text-justify">
            (This is the narration of this journal entry.)
          </p>

          <div className="form-control mt-2">
            <Link to={`edit`} className="btn btn-primary">
              Edit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
