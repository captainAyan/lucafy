import axios from "axios";

import {
  GET_MICRO_STATEMENT_URL,
  GET_TRIAL_BALANCE_URL,
} from "../../constants/api";
import authConfig from "../../util/authConfig";

const getTrialBalance = async (token) => {
  const response = await axios.get(GET_TRIAL_BALANCE_URL, authConfig(token));

  return response.data;
};

const getMicroStatement = async (token) => {
  const response = await axios.get(GET_MICRO_STATEMENT_URL, authConfig(token));

  return response.data;
};

const statementService = {
  getTrialBalance,
  getMicroStatement,
};

export default statementService;
