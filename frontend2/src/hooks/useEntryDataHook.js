import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import authConfig from "../util/authConfig";
import {
  CREATE_ENTRY_URL,
  EDIT_ENTRY_URL,
  GET_ENTRY_URL,
  NORMALIZE_ENTRY_URL,
} from "../constants/api";

export function useEntryDataHook(token, id) {
  return useQuery({
    queryKey: ["entry", id],
    queryFn: () => axios.get(`${GET_ENTRY_URL}${id}`, authConfig(token)),
  });
}

export function useAddEntryHook(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry) =>
      axios.post(CREATE_ENTRY_URL, entry, authConfig(token)),
    onSuccess: (data) => {
      queryClient.invalidateQueries("journal");
      queryClient.setQueryData(["entry", data?.data?.id], data);
    },
  });
}

export function useEditEntryHook(token, id) {
  return useMutation({
    mutationKey: ["entry", id],
    mutationFn: (entry) =>
      axios.put(`${EDIT_ENTRY_URL}${id}`, entry, authConfig(token)),
  });
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

export function useJournalDataHook(
  token,
  page = 1,
  order = "newest",
  limit = 10,
  keyword = ""
) {
  const query = new URLSearchParams({ page, order, limit, keyword });

  return useQuery({
    queryKey: ["journal", query.toString()],
    queryFn: () => axios.get(`${GET_ENTRY_URL}?${query}`, authConfig(token)),
  });
}
