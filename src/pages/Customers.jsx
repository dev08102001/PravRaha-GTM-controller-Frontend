import { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  assignManager,
} from "../services/customerService";

import {
  getUsers,
} from "../services/userService";

export default function Customers() {
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const currentRole =
    currentUser.role?.toLowerCase();
  const [customers, setCustomers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchCustomers();

    if (currentRole === "admin") {
      fetchManagers();
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();

      if (response?.success) {
        setCustomers(response.data || []);
      }
    } catch (error) {
      console.error(
        "Customers Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
  try {
    const response = await getUsers();

    if (response?.success) {
      const managerUsers =
        response.data.filter(
          (user) =>
            user.role?.toLowerCase() ===
            "manager"
        );

      setManagers(managerUsers);
    }
  } catch (error) {
    console.error(
      "Managers Fetch Error:",
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

  const handleCreateCustomer = async (
    e
  ) => {
    e.preventDefault();

    try {
      const response =
        await createCustomer(formData);

      if (response?.success) {
        setCustomers((prev) => [
          response.data,
          ...prev,
        ]);

        setFormData({
          name: "",
          companyName: "",
          email: "",
          phone: "",
        });

        setShowModal(false);

        alert(
          "Customer created successfully"
        );
      }
    } catch (error) {
      console.error(
        "Create Customer Error:",
        error
      );

      alert(
        "Failed to create customer"
      );
    }
  };

  const handleDeleteCustomer = async (
    id
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(id);

      setCustomers((prev) =>
        prev.filter(
          (customer) =>
            customer._id !== id
        )
      );

      alert(
        "Customer deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete Customer Error:",
        error
      );

      alert(
        "Failed to delete customer"
      );
    }
  };
  const handleAssignManager = async (
  customerId,
  managerId
) => {
  try {
    const response =
      await assignManager(
        customerId,
        managerId
      );

    if (response?.success) {
      fetchCustomers();

      alert(
        "Manager assigned successfully"
      );
    }
  } catch (error) {
    console.error(
      "Assign Manager Error:",
      error
    );

    alert(
      error?.response?.data?.message ||
      "Failed to assign manager"
    );
  }
};
  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading Customers...
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Customers Management
        </h1>

      {currentRole === "admin" && (
        <button
          onClick={() =>
            setShowModal(true)
          }
          className="px-5 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold"
        >
          + Create Customer
        </button>
      )}
      </div>

      {/* Table */}
      <div className="bg-[#151D2E] rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A2340] border-b border-slate-700">
              <th className="text-left p-4">
                Contact
              </th>

              <th className="text-left p-4">
                Company
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Phone
              </th>

              <th className="text-left p-4">
                Manager
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (customer) => (
                <tr
                  key={customer._id}
                  className="border-b border-slate-800 hover:bg-[#1A2340]/50"
                >
                  <td className="p-4">
                    {customer.name}
                  </td>

                  <td className="p-4">
                    {
                      customer.companyName
                    }
                  </td>

                  <td className="p-4">
                    {customer.email ||
                      "-"}
                  </td>

                  <td className="p-4">
                    {customer.phone ||
                      "-"}
                  </td>

                <td className="p-4">
                  {currentRole === "admin" ? (
                    <select
                      value={
                        customer.managerId?._id || ""
                      }
                      onChange={(e) => {
                        if (!e.target.value) return;

                      handleAssignManager(
                        customer._id,
                        e.target.value
                      );
                    }}
                      className="bg-[#0E1422] border border-slate-700 rounded px-2 py-1"
                   >
                    <option value="">
                      Select Manager
                    </option>

                    {managers.map((manager) => (
                      <option
                        key={manager._id}
                        value={manager._id}
                    >
                      {manager.firstName} {manager.lastName}
                    </option>
                  ))}
                </select>
            ) : (
              customer.managerId
                ? `${customer.managerId.firstName} ${customer.managerId.lastName}`
                : "Unassigned"
            )}
          </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-400">
                      {customer.status?.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-4">
                    {currentRole === "admin" && (
                      <button
                        onClick={() =>
                          handleDeleteCustomer(
                            customer._id
                          )
                        }
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No customers found
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#151D2E] border border-slate-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-6">
              Create Customer
            </h2>

            <form
              onSubmit={
                handleCreateCustomer
              }
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Primary Contact Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
              />

              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={
                  formData.companyName
                }
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
              />

              <input
                type="email"
                name="email"
                placeholder="Primary Contact Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
              />

              <input
                type="text"
                name="phone"
                placeholder="Primary Contact Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-[#0E1422] border border-slate-700 rounded-lg"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}