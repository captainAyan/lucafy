import {
  ASSET,
  EQUITY,
  EXPENDITURE,
  INCOME,
  LIABILITY,
} from "../constants/ledgerTypes";

/**
 * The ledger balance in the API response can be positive or negative. The +ve
 * balance is the expected balance for a debit type (expenditure, and asset)
 * ledger, and -ve balance is the expected balance for a credit type (equity,
 * liability, and income) account.
 *
 * @return
 * +ve balance in EXPENDITURE, and ASSET = false
 * -ve balance in EQUITY, LIABILITY, and INCOME = false
 * else = true
 */

export default function balanceIsNegative(type, balance) {
  return (
    (type === (EXPENDITURE || ASSET) && balance < 0) ||
    (type === (INCOME || LIABILITY || EQUITY) && 0 > balance)
  );
}
