import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { GET_TRIAL_BALANCE_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export default function useTrialBalanceData(token) {
  return useQuery({
    queryKey: ["trial-balance"],
    queryFn: () => axios.get(GET_TRIAL_BALANCE_URL, authConfig(token)),
  });
}
