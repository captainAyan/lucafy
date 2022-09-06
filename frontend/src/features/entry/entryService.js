import axios from "axios";

import {
  CREATE_ENTRY_URL,
  GET_ENTRY_URL,
  EDIT_ENTRY_URL,
} from "../../constants/api";
import authConfig from "../../util/authConfig";

const create = async (entry, token) => {
  const response = await axios.post(CREATE_ENTRY_URL, entry, authConfig(token));

  return response.data;
};

const getJournal = async (page, token) => {
  const query = new URLSearchParams({ page });
  const response = await axios.get(
    `${GET_ENTRY_URL}?${query}`,
    authConfig(token)
  );

  return response.data;
};

const getById = async (id, token) => {
  const response = await axios.get(`${GET_ENTRY_URL}${id}`, authConfig(token));

  return response.data;
};

const edit = async (id, data, token) => {
  const response = await axios.put(
    `${EDIT_ENTRY_URL}${id}`,
    data,
    authConfig(token)
  );

  return response.data;
};

const entryService = {
  create,
  getJournal,
  getById,
  edit,
};

export default entryService;
