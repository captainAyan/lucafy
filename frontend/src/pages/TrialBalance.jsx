import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import TrialBalanceItem from "../components/TrialBalanceItem";
import statementService from "../features/statement/statementService";

export default function TrialBalance() {
  const { user } = useSelector((state) => state.auth);
  const { amountFormat: currencyFormat, currency } = useSelector(
    (state) => state.preference
  );

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const [trialBalanceItems, setTrialBalanceItems] = useState([]);

  const getTrialBalance = async () => {
    setIsLoading(true);
    try {
      const s = await statementService.getTrialBalance(user?.token);
      setTrialBalanceItems(s);
    } catch (e) {
      setTrialBalanceItems([]);
      setError(e.response.data.error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getTrialBalance();
    }
  }, [user, navigate]);

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Trial Balance</h1>

          {error ? <Alert type="error" message={error} /> : null}

          <div className="mb-4">{isLoading ? <Loading /> : null}</div>

          {trialBalanceItems.map((item) => {
            return (
              <TrialBalanceItem
                key={item.ledger.id}
                ledger={item.ledger}
                balance={item.balance}
                currencyFormat={currencyFormat}
                currencySymbol={currency}
              />
            );
          })}

          {!isLoading && trialBalanceItems.length === 0 ? (
            <h1 className="text-2xl font-thin text-left mb-4">No Data</h1>
          ) : null}
        </div>
      </center>
    </div>
  );
}
