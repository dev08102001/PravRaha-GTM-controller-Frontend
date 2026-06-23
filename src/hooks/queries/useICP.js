import {useQuery,useMutation,useQueryClient,} from "@tanstack/react-query";

import {getICP,getICPConfig,saveICP,} from "../../services/icpService";

export const useICP = () => {
  return useQuery({
    queryKey: ["icp"],
    queryFn: getICP,
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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["icp"],
      });

      alert("ICP Saved Successfully");
    },
  });
};