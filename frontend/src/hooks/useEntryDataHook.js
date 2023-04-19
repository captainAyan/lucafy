import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import authConfig from "../util/authConfig";
import {
  CREATE_ENTRY_URL,
  EDIT_ENTRY_URL,
  GET_ENTRY_URL,
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
    { onSuccess: () => queryClient.invalidateQueries("journal") }
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
