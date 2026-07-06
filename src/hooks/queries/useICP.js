import {useQuery,useMutation,useQueryClient,} from "@tanstack/react-query";

import {getICP,getICPConfig,saveICP,deleteICP,} from "../../services/icpService";


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

export const useSaveICP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveICP,

    onSuccess: (res) => {
      // Immediately seed the cache with the saved ICP so the gate unlocks
      // without waiting for a refetch.
      if (res?.data) {
        queryClient.setQueryData(["icp"], res.data);
      }

      queryClient.invalidateQueries({
        queryKey: ["icp"],
      });
      // Outreach queue is pruned to the new Decision Makers / Influencers.
      queryClient.invalidateQueries({
        queryKey: ["outreach"],
      });
      queryClient.invalidateQueries({
        queryKey: ["top-companies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["signal-feed"],
      });

      alert("ICP Saved Successfully");
    },
  });
};

export const useDeleteICP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteICP,

    onSuccess: () => {
      // Clear the cached ICP so the gate re-locks the app immediately.
      queryClient.setQueryData(["icp"], null);

      queryClient.invalidateQueries({
        queryKey: ["icp"],
      });
      queryClient.invalidateQueries({
        queryKey: ["outreach"],
      });

      alert("ICP Deleted Successfully");
    },
  });
};
