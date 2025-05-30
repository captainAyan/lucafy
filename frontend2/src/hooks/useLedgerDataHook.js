import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  CREATE_LEDGER_URL,
  EDIT_LEDGER_URL,
  GET_ALL_LEDGER_URL,
  GET_LEDGER_STATEMENT_URL,
  GET_LEDGER_URL,
} from "../constants/api";
import authConfig from "../util/authConfig";

export function useAllLedgerDataHook(token) {
  return useQuery({
    queryKey: ["ledgers"],
    queryFn: () => axios.get(`${GET_ALL_LEDGER_URL}`, authConfig(token)),
  });
}

export function useAddLedgerHook(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ledger) =>
      axios.post(CREATE_LEDGER_URL, ledger, authConfig(token)),
    onSuccess: (data) => {
      queryClient.invalidateQueries("ledgers");
      queryClient.setQueryData(["ledger", data?.data?.id], data);
    },
  });
}

export function useLedgerStatementDataHook(
  token,
  id,
  page = 1,
  order = "newest",
  limit = 10
) {
  const query = new URLSearchParams({ page, order, limit });
  return useQuery({
    queryKey: ["ledger-statement", id, query.toString()],
    queryFn: () =>
      axios.get(`${GET_LEDGER_STATEMENT_URL}${id}?${query}`, authConfig(token)),
  });
}

export function useLedgerDataHook(token, id) {
  return useQuery({
    queryKey: ["ledger", id],
    queryFn: () => axios.get(`${GET_LEDGER_URL}${id}`, authConfig(token)),
  });
}

export function useEditLedgerHook(token, id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ledger", id],
    mutationFn: (ledger) =>
      axios.put(`${EDIT_LEDGER_URL}${id}`, ledger, authConfig(token)),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["ledger-statement", id]);
      queryClient.setQueryData(["ledger", id], data);
    },
  });
}
