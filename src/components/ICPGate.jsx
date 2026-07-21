import { Navigate, useLocation } from "react-router-dom";

import { useICP } from "../hooks/queries/useICP";
import {
  isICPConfigured,
  ICP_GATED_ROLES,
} from "../utils/icpUtils";
import { normalizeRole } from "../utils/roleUtils";

export default function ICPGate({ children }) {
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = normalizeRole(user?.role);
  const isGated = ICP_GATED_ROLES.includes(role);

  const {
    data: icp,
    isLoading,
  } = useICP({ enabled: isGated });

  // Roles that don't require ICP setup pass straight through.
  if (!isGated) {
    return children;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#080C18] text-white text-xl">
        Checking your workspace...
      </div>
    );
  }

  const configured = isICPConfigured(icp);

  // Lock every page (dashboard included) until ICP is configured and saved.
  // The ICP config page itself stays reachable so the client can complete setup.
  if (!configured && location.pathname !== "/icp") {
    return (
      <Navigate
        to="/icp"
        replace
      />
    );
  }

  return children;
}
