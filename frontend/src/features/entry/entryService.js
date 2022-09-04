import axios from "axios";

import {
  CREATE_ENTRY_URL,
  GET_ENTRY_URL,
  EDIT_ENTRY_URL,
} from "../../constants/api";

const create = async (entry, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(CREATE_ENTRY_URL, entry, config);

  return response.data;
};

const getJournal = async (page, token) => {
  const query = new URLSearchParams({ page });
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${GET_ENTRY_URL}?${query}`, config);

  return response.data;
};

const getById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${GET_ENTRY_URL}${id}`, config);

  return response.data;
};

const edit = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${EDIT_ENTRY_URL}${id}`, data, config);

  return response.data;
};

const entryService = {
  create,
  getJournal,
  getById,
  edit,
};

export default entryService;
