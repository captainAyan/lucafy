import axios from "axios";

import { GET_TRIAL_BALANCE_URL } from "../../constants/api";
import authConfig from "../../util/authConfig";

const getTrialBalance = async (token) => {
  const response = await axios.get(GET_TRIAL_BALANCE_URL, authConfig(token));

  return response.data;
};

const statementService = {
  getTrialBalance,
};

export default statementService;
