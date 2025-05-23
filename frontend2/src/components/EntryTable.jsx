import { Link } from "react-router-dom";

import Amount from "./Amount";
import Time from "./Time";

export function EntryTable({ children }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-indigo-100">
        <tr>
          <th
            scope="col"
            className="pe-2 ps-4 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            ID
          </th>
          <th
            scope="col"
            className="px-2 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            Time
          </th>
          <th
            scope="col"
            className="px-2 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            Debit
          </th>
          <th
            scope="col"
            className="px-2 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            Credit
          </th>
          <th
            scope="col"
            className="px-2 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            Amount
          </th>

          <th
            scope="col"
            className="ps-2 pe-4 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            Narration
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">{children}</tbody>
    </table>
  );
}

export function EntryTableRow({
  id,
  debit_ledger: debit,
  credit_ledger: credit,
  amount,
  narration,
  created_at,
}) {
  return (
    <tr>
      <td className="py-4 ps-4 pe-2 text-sm font-mono uppercase">
        <Link to={`/entry/${id}`} className="hover:underline text-indigo-600">
          {"#" + String(id).slice(-6)}
        </Link>
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-sm">
        <Time time={created_at} />
      </td>
      <td className="px-2 py-4 text-sm text-indigo-600">
        <Link
          to={`/ledger/${debit?._id}`}
          title={debit?.description}
          className="hover:underline"
        >
          <span className="capitalize">{debit?.name}</span> A/c
        </Link>
      </td>
      <td className="px-2 py-4 text-sm text-indigo-600">
        <Link
          to={`/ledger/${credit?._id}`}
          title={credit?.description}
          className="hover:underline"
        >
          <span className="capitalize">{credit?.name}</span> A/c
        </Link>
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-end text-sm">
        <Amount amount={amount} />
      </td>
      <td className="pe-4 ps-2 py-4 text-start text-sm">{narration}</td>
    </tr>
  );
}
