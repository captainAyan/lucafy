import axios from "axios";

import {
  CREATE_LEDGER_URL,
  GET_LEDGER_URL,
  GET_ALL_LEDGER_URL,
  EDIT_LEDGER_URL,
  GET_LEDGER_STATEMENT_URL,
} from "../../constants/api";
import authConfig from "../../util/authConfig";

const create = async (ledger, token) => {
  const response = await axios.post(
    CREATE_LEDGER_URL,
    ledger,
    authConfig(token)
  );

  return response.data;
};

const getAll = async (token) => {
  const response = await axios.get(GET_ALL_LEDGER_URL, authConfig(token));

  return response.data;
};

const getById = async (id, token) => {
  const response = await axios.get(`${GET_LEDGER_URL}${id}`, authConfig(token));

  return response.data;
};

const edit = async (id, data, token) => {
  const response = await axios.put(
    `${EDIT_LEDGER_URL}${id}`,
    data,
    authConfig(token)
  );

  return response.data;
};

const getStatement = async (id, page, token) => {
  const query = new URLSearchParams({ page });

  const response = await axios.get(
    `${GET_LEDGER_STATEMENT_URL}${id}?${query}`,
    authConfig(token)
  );

  return response.data;
};

const ledgerService = {
  create,
  getAll,
  getStatement,
  getById,
  edit,
};

export default ledgerService;
