import axios from "axios";

import {
  GET_CALENDAR_HEATMAP_URL,
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

const getCalendarHeatmap = async (token) => {
  const response = await axios.get(GET_CALENDAR_HEATMAP_URL, authConfig(token));

  return response.data;
};

const statementService = {
  getTrialBalance,
  getMicroStatement,
  getCalendarHeatmap,
};

export default statementService;
