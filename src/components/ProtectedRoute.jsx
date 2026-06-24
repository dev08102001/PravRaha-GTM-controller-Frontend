import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  roles = [],
}) {
  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userRole =
    user?.role?.toLowerCase();

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
    !roles.includes(userRole)
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