const META_KEYS = new Set([
  "_id",
  "user",
  "__v",
  "createdAt",
  "updatedAt",
]);

// An ICP counts as "configured" only after the client has selected at least
// one value in any section and saved it.
export const isICPConfigured = (icp) => {
  if (!icp || typeof icp !== "object") return false;

  return Object.entries(icp).some(
    ([key, value]) =>
      !META_KEYS.has(key) &&
      Array.isArray(value) &&
      value.length > 0
  );
};

// Roles that must complete ICP setup before they can use the rest of the app.
// This must match the role allowed to open the ICP Config page (/icp),
// otherwise a gated user would be redirected to a page they can't access.
export const ICP_GATED_ROLES = ["super_admin"];
