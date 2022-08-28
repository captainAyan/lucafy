import Entry from "../components/Entry";

export default function Journal() {
  const cash = { _id: "1", name: "cash" };
  const salary = { _id: "2", name: "salary" };
  const pocketName = { _id: "3", name: "pocket name" };
  const expenses = { _id: "4", name: "expenses" };

  return (
    <div className="p-4 min-h-screen">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Journal</h1>

          <Entry
            _id="1"
            debit={cash}
            credit={salary}
            amount="1,000.00"
            narration="The href attribute is required for an anchor to be keyboard accessible."
          />
          <Entry
            _id="2"
            debit={expenses}
            credit={cash}
            amount="170.00"
            narration="Being amount spent on Rakshabandhan gift."
          />
          <Entry
            _id="3"
            debit={cash}
            credit={pocketName}
            amount="258.00"
            narration="Being pocket money received."
          />
          <Entry
            _id="4"
            debit={expenses}
            credit={cash}
            amount="992.00"
            narration="Being amount spent on chest bag."
          />

          <div className="btn-group w-full max-w-sm">
            <button className="btn">«</button>
            <button className="btn">Page 22</button>
            <button className="btn">»</button>
          </div>
        </div>
      </center>
    </div>
  );
}
