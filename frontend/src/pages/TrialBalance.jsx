import { useSelector } from "react-redux";
import { LedgerTable, LedgerTableRow } from "../components/LedgerTable";
import useTrialBalanceData from "../hooks/useTrialBalanceData";
import {
  ASSET,
  EQUITY,
  EXPENDITURE,
  INCOME,
  LIABILITY,
} from "../constants/ledgerTypes";

export default function TrialBalance() {
  const { token } = useSelector((state) => state.auth);

  const { isLoading, isSuccess, data, isError, error } =
    useTrialBalanceData(token);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Trial Balance</h1>

      <div className="bg-white rounded-xl mb-4">
        {isLoading && <h1 className="text-xl text-center p-4">Loading...</h1>}

        <div className="p-4 flex flex-col">
          <p className="text-sm break-all uppercase">
            <span className="font-bold">As on date:</span>
            <span className="ml-2">01/02/2025</span>
          </p>
        </div>

        <LedgerTable
          debitBalance={data?.data?.reduce(
            (drBal, d) =>
              d.ledger.type === ASSET || d.ledger.type === EXPENDITURE
                ? drBal + d.balance
                : drBal,
            0
          )}
          creditBalance={data?.data?.reduce(
            (crBal, d) =>
              d.ledger.type === LIABILITY ||
              d.ledger.type === INCOME ||
              d.ledger.type === EQUITY
                ? crBal + d.balance
                : crBal,
            0
          )}
        >
          {data?.data?.map((d) => {
            return (
              <LedgerTableRow
                balance={d.balance}
                {...d.ledger}
                key={d.ledger.id}
              />
            );
          })}
        </LedgerTable>
      </div>
    </>
  );
}
