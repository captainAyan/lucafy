import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { EDIT_PROFILE_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export function useEditUserProfileHook(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user", "me"],
    mutationFn: (userData) =>
      axios.put(`${EDIT_PROFILE_URL}`, userData, authConfig(token)),
    onSuccess: (data) => {
      queryClient.setQueryData(["user", "me"], data);
    },
  });
}
