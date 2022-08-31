import axios from "axios";

import {
  CREATE_LEDGER_URL,
  GET_LEDGER_URL,
  GET_ALL_LEDGER_URL,
  EDIT_LEDGER_URL,
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

const ledgerService = {
  create,
  // getAll,
  // getOne,
  // edit,
};

export default ledgerService;
