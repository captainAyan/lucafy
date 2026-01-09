import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import authConfig from "../util/authConfig";
import { GET_MICRO_STATEMENT_URL } from "../constants/api";

export default function useMicroStatementData(token) {
  return useQuery({
    queryKey: ["micro-statement"],
    queryFn: () => axios.get(GET_MICRO_STATEMENT_URL, authConfig(token)),
  });
}
