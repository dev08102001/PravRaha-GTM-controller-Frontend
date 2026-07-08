import api from "./api";

/*
|--------------------------------------------------------------------------
| GET USERS
|--------------------------------------------------------------------------
*/
export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

/*
|--------------------------------------------------------------------------
| CREATE USER
|--------------------------------------------------------------------------
*/
export const createUser = async (payload) => {
  const { data } = await api.post(
    "/users",
    payload
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| UPDATE ROLE
|--------------------------------------------------------------------------
*/
export const updateUserRole = async (
  userId,
  role
) => {
  const { data } = await api.put(
    `/users/${userId}/role`,
    {
      role,
    }
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| UPDATE INTEGRATIONS
|--------------------------------------------------------------------------
*/
export const updateUserIntegrations =
  async (
    userId,
    integrations
  ) => {
    const { data } = await api.put(
      `/users/${userId}/integrations`,
      {
        integrations,
      }
    );

    return data;
  };

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/
export const deleteUser = async (
  userId
) => {
  const { data } = await api.delete(
    `/users/${userId}`
  );

  return data;
};