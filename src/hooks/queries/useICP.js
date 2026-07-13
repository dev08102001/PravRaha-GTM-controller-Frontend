import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getICP,
  getICPConfig,
  getTechStack,
  saveICP,
  deleteICP,
} from "../../services/icpService";

export const useICP = (options = {}) => {
  return useQuery({
    queryKey: ["icp"],
    queryFn: getICP,
    ...options,
  });
};

export const useICPConfig = () => {
  return useQuery({
    queryKey: ["icp-config"],
    queryFn: getICPConfig,
  });
};

export const useTechStack = () => {
  return useQuery({
    queryKey: ["tech-stack"],
    queryFn: getTechStack,
  });
};

export const useSaveICP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveICP,

    onSuccess: (res) => {
      if (res?.data) {
        queryClient.setQueryData(["icp"], res.data);
      }

      queryClient.invalidateQueries({ queryKey: ["icp"] });
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      queryClient.invalidateQueries({ queryKey: ["top-companies"] });
      queryClient.invalidateQueries({ queryKey: ["signal-feed"] });

      alert("ICP Saved Successfully");
    },
  });
};

export const useDeleteICP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteICP,

    onSuccess: () => {
      queryClient.setQueryData(["icp"], null);
      queryClient.invalidateQueries({ queryKey: ["icp"] });
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      alert("ICP Deleted Successfully");
    },
  });
};
