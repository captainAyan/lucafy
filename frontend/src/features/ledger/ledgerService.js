import axios from "axios";

import {
  CREATE_LEDGER_URL,
  GET_LEDGER_URL,
  GET_ALL_LEDGER_URL,
  EDIT_LEDGER_URL,
  GET_LEDGER_STATEMENT_URL,
} from "../../constants/api";

const create = async (ledger, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(CREATE_LEDGER_URL, ledger, config);

  return response.data;
};

const getAll = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(GET_ALL_LEDGER_URL, config);

  return response.data;
};

const getStatement = async (id, page, token) => {
  const query = new URLSearchParams({ page });
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(
    `${GET_LEDGER_STATEMENT_URL}${id}?${query}`,
    config
  );

  return response.data;
};

const ledgerService = {
  create,
  getAll,
  getStatement,
  // getOne,
  // edit,
};

export default ledgerService;
