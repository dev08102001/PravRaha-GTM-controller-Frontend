/**
 * Normalize role values from login/localStorage into app canonical roles.
 * DB may send: superadmin | super admin | super_admin
 * App expects: super_admin | admin | user
 */
export const normalizeRole = (value) => {
  const raw = (value || "").toString().toLowerCase().trim();

  if (
    raw === "superadmin" ||
    raw === "super admin" ||
    raw === "super_admin"
  ) {
    return "super_admin";
  }

  if (raw === "admin" || raw === "administrator") {
    return "admin";
  }

  if (raw === "marketing" || raw === "manager") {
    return "user";
  }

  return raw || "user";
};

export const isSuperAdmin = (value) =>
  normalizeRole(value) === "super_admin";
