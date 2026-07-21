import { useQuery } from "@tanstack/react-query";
import { getMeetingAlert } from "../../services/meetingService";

export default function useMeetingAlert() {
  return useQuery({
    queryKey: ["meeting-alert"],
    queryFn: getMeetingAlert,
  });
}