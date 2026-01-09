import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import authConfig from "../util/authConfig";
import {
  CREATE_ENTRY_URL,
  EDIT_ENTRY_URL,
  GET_ENTRY_URL,
  NORMALIZE_ENTRY_URL,
  SEARCH_ENTRY_URL,
} from "../constants/api";

export function useEntryDataHook(token, id) {
  return useQuery(["entry", id], () =>
    axios.get(`${GET_ENTRY_URL}${id}`, authConfig(token))
  );
}

export function useAddEntryHook(token) {
  const queryClient = useQueryClient();
  return useMutation(
    (entry) => axios.post(CREATE_ENTRY_URL, entry, authConfig(token)),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("journal");
        queryClient.setQueryData(["entry", data?.data?.id], data);
      },
    }
  );
}

export function useEditEntryHook(token, id) {
  const queryClient = useQueryClient();
  return useMutation(
    (entry) => axios.put(`${EDIT_ENTRY_URL}${id}`, entry, authConfig(token)),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["entry", id], (oldQueryData) => {
          return { ...oldQueryData, data: { ...data?.data } };
        });
      },
    }
  );
}

export function useEntryNormalizationHook(token, id) {
  const queryClient = useQueryClient();

  return useMutation(
    () => axios.put(`${NORMALIZE_ENTRY_URL}${id}`, null, authConfig(token)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["entry", id]);
        queryClient.invalidateQueries("journal");
      },
    }
  );
}

export function useJournalDataHook(token, page) {
  const query = new URLSearchParams({ page });
  return useQuery(["journal", page], () =>
    axios.get(`${GET_ENTRY_URL}?${query}`, authConfig(token))
  );
}

export function useSearchDataHook(token, keyword, page) {
  const query = new URLSearchParams({ page, search: keyword });
  return useQuery(["entry-search", keyword, page], () =>
    axios.get(`${SEARCH_ENTRY_URL}?${query}`, authConfig(token))
  );
}
