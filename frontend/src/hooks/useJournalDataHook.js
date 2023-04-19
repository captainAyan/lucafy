import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import authConfig from "../util/authConfig";
import { GET_ENTRY_URL } from "../constants/api";

export default function useJournalDataHook(token, page) {
  const query = new URLSearchParams({ page });
  return useQuery(["journal", page], () =>
    axios.get(`${GET_ENTRY_URL}?${query}`, authConfig(token))
  );
}
