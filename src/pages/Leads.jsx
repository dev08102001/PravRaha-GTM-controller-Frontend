import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useLeads from "../hooks/queries/useLeads";
import NewLeadModal from "../components/NewLeadModal";

import { deleteLead } from "../services/leadService";

export default function Leads() {
  const {
    data: leads = [],
    isLoading,
    isError,
  } = useLeads();

  const queryClient = useQueryClient();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role =
    currentUser.role?.toLowerCase();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingLead, setEditingLead] =
    useState(null);

  const handleCreate = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (lead) => {
    const confirmDelete = window.confirm(
      `Delete ${lead.firstName} ${lead.lastName}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteLead(lead._id);

      await queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });

      alert("Lead deleted successfully");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete lead"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="text-white text-xl">
        Loading Leads...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-xl">
        Failed to load leads
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Leads
          </h1>

          <p className="text-gray-400 mt-2">
            Total Leads: {leads.length}
          </p>
        </div>

        {role !== "user" && (
          <button
            onClick={handleCreate}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl text-white font-semibold"
          >
            + New Lead
          </button>
        )}
      </div>

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="bg-[#151D2E] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            No Leads Found
          </h2>

          <p className="text-gray-400 mt-2">
            Create your first lead.
          </p>
        </div>
      )}

      {/* Leads Table */}
      {leads.length > 0 && (
        <div className="bg-[#151D2E] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1A2340]">
              <tr>
                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-left p-4">
                  Company
                </th>

                <th className="text-left p-4">
                  Designation
                </th>

                <th className="text-left p-4">
                  Email
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
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-t border-gray-800"
                >
                  <td className="p-4 text-white">
                    {lead.firstName}{" "}
                    {lead.lastName}
                  </td>

                  <td className="p-4 text-gray-300">
                    {lead.company}
                  </td>

                  <td className="p-4 text-gray-300">
                    {lead.designation}
                  </td>

                  <td className="p-4 text-gray-300">
                    {lead.email}
                  </td>

                  <td className="p-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm">
                      {lead.status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">
                    {role !== "user" && (
                      <button
                        onClick={() =>
                          handleEdit(lead)
                        }
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                    )}

                    {role === "admin" && (
                      <button
                        onClick={() =>
                          handleDelete(lead)
                        }
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewLeadModal
        isOpen={isModalOpen}
        lead={editingLead}
        onClose={() => {
          setEditingLead(null);
          setIsModalOpen(false);
        }}
        onSuccess={async () => {
          setEditingLead(null);
          setIsModalOpen(false);

          await queryClient.invalidateQueries({
            queryKey: ["leads"],
          });
          queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        }}
      />
    </div>
  );
}