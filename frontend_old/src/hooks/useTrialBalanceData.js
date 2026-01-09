import { GET_TRIAL_BALANCE_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import useFetch from "./useFetch";

export default function useTrialBalanceData(token) {
  return useFetch({
    url: GET_TRIAL_BALANCE_URL,
    method: "GET",
    ...authConfig(token),
  });
}
