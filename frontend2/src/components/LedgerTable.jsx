import { Link } from "react-router-dom";

import Amount from "./Amount";
import { ASSET, EXPENDITURE } from "../constants/ledgerTypes";

/**
 * Ledger table is used for creating Trial Balance, Profit and Loss statement,
 * and Balance Sheet; as all of them are essential tables of ledgers
 */

export function LedgerTable({ children, debitBalance, creditBalance }) {
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
            Ledger
          </th>
          <th
            scope="col"
            className="px-2 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            Dr.
          </th>
          <th
            scope="col"
            className="ps-2 pe-4 py-3 text-start text-xs font-bold text-gray-500 uppercase"
          >
            Cr.
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {children}

        <tr>
          <td></td>
          <td className="px-2 py-4 whitespace-nowrap text-sm font-bold">
            TOTAL
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-end text-sm font-bold">
            <Amount amount={debitBalance} />
          </td>
          <td className="pe-4 ps-2 py-4 text-end text-sm font-bold">
            <Amount amount={creditBalance} isCreditBalance />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function LedgerTableRow({ id, name, type, description, balance }) {
  return (
    <tr>
      <td className="py-4 ps-4 pe-2 text-sm font-mono uppercase">
        <Link to={`/ledger/${id}`} className="hover:underline text-indigo-600">
          {"#" + String(id).slice(-6)}
        </Link>
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-indigo-600">
        <Link
          to={`/ledger/${id}`}
          title={description}
          className="hover:underline"
        >
          <span className="capitalize">{name}</span> A/c
        </Link>
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-end text-sm">
        {type === ASSET || type === EXPENDITURE ? (
          <Amount amount={balance} />
        ) : (
          "-"
        )}
      </td>
      <td className="pe-4 ps-2 py-4 text-end text-sm">
        {type === ASSET || type === EXPENDITURE ? (
          "-"
        ) : (
          <Amount amount={balance} isCreditBalance />
        )}
      </td>
    </tr>
  );
}
