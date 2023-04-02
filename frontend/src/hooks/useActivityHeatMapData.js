import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import authConfig from "../util/authConfig";
import { GET_CALENDAR_HEATMAP_URL } from "../constants/api";

export default function useActivityHeatMapData(token) {
  return useQuery(["activity-heatmap"], () =>
    axios.get(GET_CALENDAR_HEATMAP_URL, authConfig(token))
  );
}
