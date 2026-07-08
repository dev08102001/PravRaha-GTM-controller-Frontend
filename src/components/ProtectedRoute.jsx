import { Navigate } from "react-router-dom";
import { normalizeRole } from "../utils/roleUtils";

export default function ProtectedRoute({
  children,
  roles = [],
}) {
  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userRole = normalizeRole(user?.role);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    roles.length > 0 &&
    !roles.map(normalizeRole).includes(userRole)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}