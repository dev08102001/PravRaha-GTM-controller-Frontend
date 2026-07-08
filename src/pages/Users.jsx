import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUserRole,
  updateUserIntegrations,
} from "../services/userService";

import {
  getCustomers,
} from "../services/customerService";

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] =
  useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    role: "user",
    customerId: "",
  });

  let currentUser = {};

  try {
    currentUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    currentUser = {};
  }

  const currentRole =
    currentUser.role?.toLowerCase();
  const currentCustomerId =
    currentUser.customerId?._id ||
    currentUser.customerId ||
    null;

  useEffect(() => {
  fetchUsers();

  if (currentRole === "super_admin") {
    fetchCustomers();
  }
}, [currentRole]);

  const fetchUsers = async () => {
    try {
  const response = await getUsers();

if (response?.success) {
  setUsers(response.data || []);
}
    } catch (error) {
      console.error("Users Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
  try {
    const response =
      await getCustomers();

    if (response?.success) {
      setCustomers(
        response.data || []
      );
    }
  } catch (error) {
    console.error(
      "Customers Fetch Error:",
      error
    );
  }
};
const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};
const handleCreateUser = async (e) => {
  e.preventDefault();

  try {
    let payload = { ...formData };

    if (currentRole === "admin") {
      payload.role = "user";
    }

  const response =
    await createUser(payload);

    if (response?.success) {
      fetchUsers();

      setShowModal(false);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
        role: "user",
        customerId: "",
      });

      alert(
        "User created successfully"
      );
    }
  } catch (error) {
    console.error(
      "Create User Error:",
      error
    );

    alert(
      error?.response?.data?.message ||
      "Failed to create user"
    );
  }
};

const updateRole = async (userId, role) => {
  try {
    const response =
      await updateUserRole(
        userId,
        role
      );

    if (response?.success) {
      await fetchUsers();

      alert(
        "Role updated successfully"
      );
    }
  } catch (error) {
    console.error(
      "Role Update Error:",
      error
    );

    alert(
      error?.response?.data?.message ||
      "Failed to update role"
    );
  }
};

   const toggleIntegration = (
    userId,
    integration
  ) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user._id !== userId) return user;

        const integrations =
          user.integrations || [];

        const updatedIntegrations =
          integrations.includes(integration)
            ? integrations.filter(
                (item) =>
                  item !== integration
              )
            : [
                ...integrations,
                integration,
              ];

        return {
          ...user,
          integrations: updatedIntegrations,
        };
      })
    );
  };

  const saveIntegrations = async (
    userId,
    integrations
  ) => {
    try {
      await updateUserIntegrations(
        userId,
        integrations
      );

      await fetchUsers();

      alert(
        "Integrations updated successfully"
      );
    } catch (error) {
      console.error(
        "Integration Update Error:",
        error
      );

      alert(
        "Failed to update integrations"
      );
    }
  };

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return "bg-red-500/20 text-red-400";

      case "admin":
        return "bg-yellow-500/20 text-yellow-400";

      case "user":
        return "bg-green-500/20 text-green-400";

      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">
     <div className="flex justify-between items-center">
  <h1 className="text-3xl font-bold">
    Users Management
  </h1>

  {currentRole !== "user" && (
    <button
      onClick={() => setShowModal(true)}
      className="px-5 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold"
    >
      + Create User
    </button>
  )}
</div> 

      <div className="bg-[#151D2E] rounded-xl border border-slate-700 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-[#1A2340]">
              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Company
              </th>

              <th className="text-left p-4">
                Designation
              </th>

              <th className="text-left p-4">
                Customer
              </th>

              <th className="text-left p-4">
                Role
              </th>

              <th className="text-left p-4">
                Integrations
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-slate-800 hover:bg-[#1A2340]/50"
              >
                <td className="p-4">
                  {user.firstName}{" "}
                  {user.lastName}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.company || "-"}
                </td>

                <td className="p-4">
                  {user.designation || "-"}
                </td>

                <td className="p-4">
                  {user.customerId?.companyName || "-"}
                </td>

                <td className="p-4">
                  {currentRole === "super_admin" ? (
                    <select
                      value={user.role || "user"}
                      disabled={
                        currentUser._id === user._id
                      }
                      onChange={(e) =>
                        updateRole(
                          user._id,
                          e.target.value
                        )
                      }

                      className={`px-3 py-2 rounded-lg text-xs font-bold bg-[#0E1422] border border-slate-600 ${getRoleClass(
                        user.role
                      )}`}
                    >
                      <option value="super_admin">
                        SUPER ADMIN
                      </option>

                      <option value="admin">
                        ADMIN
                      </option>

                      <option value="user">
                        USER
                      </option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-2 rounded-lg text-xs font-bold ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {user.role === "super_admin"
                        ? "SUPER ADMIN"
                        : user.role === "admin"
                        ? "ADMIN"
                        : "USER"}
                    </span>
                  )}
                </td>

                  <td className="p-4">
                    {(currentRole === "super_admin" ||

                      (currentRole === "admin" &&
                      (
                        currentUser._id === user._id ||
                        (
                          user.role === "user" &&
                          String(
                            user.customerId?._id ||
                            user.customerId
                          ) === String(currentCustomerId)
                        )
                      )) ||

                      (currentRole === "user" &&
                        currentUser._id === user._id)) ? (
                    <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          user.integrations?.includes(
                            "Apollo.io"
                          ) || false
                        }
                        onChange={() =>
                          toggleIntegration(
                            user._id,
                            "Apollo.io"
                          )
                        }
                      />
                      Apollo.io
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          user.integrations?.includes(
                            "Clay"
                          ) || false
                        }
                        onChange={() =>
                          toggleIntegration(
                            user._id,
                            "Clay"
                          )
                        }
                      />
                      Clay
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          user.integrations?.includes(
                            "Drup"
                          ) || false
                        }
                        onChange={() =>
                          toggleIntegration(
                            user._id,
                            "Drup"
                          )
                        }
                      />
                      Drup
                    </label>

                    <button
                      onClick={() =>
                        saveIntegrations(
                          user._id,
                          user.integrations ||
                            []
                        )
                      }
                      className="mt-2 px-3 py-1 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-xs font-semibold"
                    >
                      Save
                    </button>
                  </div>
                  ) : (
                    <span className="text-gray-500">
                      No Access
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No users found
          </div>
        )}
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-[#151D2E] border border-slate-700 rounded-xl w-full max-w-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Create User
      </h2>

      <form
        onSubmit={handleCreateUser}
        className="space-y-4"
      >
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
          className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
        />

        {currentRole === "super_admin" && (
          <>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                ADMIN
              </option>

              <option value="super_admin">
                SUPER ADMIN
              </option>
            </select>

            {formData.role !== "super_admin" && (
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={customer._id}
                      value={customer._id}
                    >
                      {customer.companyName}
                    </option>
                  )
                )}
              </select>
            )}
          </>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              setShowModal(false)
            }
            className="px-4 py-2 bg-slate-600 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 rounded-lg"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}