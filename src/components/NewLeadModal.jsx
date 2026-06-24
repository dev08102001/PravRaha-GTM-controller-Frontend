import { useEffect, useState } from "react";
import {
  createLead,
  updateLead,
} from "../services/leadService";

import api from "../services/api";

export default function NewLeadModal({
  isOpen,
  onClose,
  onSuccess,
  lead = null,
}) {
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    campaignId: "",
    assignedTo: "",
    firstName: "",
    lastName: "",
    company: "",
    designation: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    status: "new",
  });

  useEffect(() => {
    if (!isOpen) return;

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (lead) {
      setForm({
        campaignId:
          lead.campaignId?._id ||
          lead.campaignId ||
          "",
        assignedTo:
          lead.assignedTo?._id ||
          lead.assignedTo ||
          "",
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        company: lead.company || "",
        designation:
          lead.designation || "",
        email: lead.email || "",
        phone: lead.phone || "",
        linkedinUrl:
          lead.linkedinUrl || "",
        status: lead.status || "new",
      });
    }
  }, [lead]);
  useEffect(() => {
  if (!lead && isOpen) {
    setForm({
      campaignId: "",
      assignedTo: "",
      firstName: "",
      lastName: "",
      company: "",
      designation: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      status: "new",
    });
  }
}, [lead, isOpen]);

  const loadData = async () => {
  try {
    const campaignsRes =
      await api.get("/campaigns");

    const usersRes =
      await api.get("/users");

    setCampaigns(
      campaignsRes.data.data || []
    );

    setUsers(
      (usersRes.data.data || []).filter(
        (user) =>
          user.role?.toLowerCase() ===
          "user"
      )
    );
  } catch (error) {
    console.error(error);
  }
};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };
useEffect(() => {
  if (!lead && form.campaignId) {
    setForm((prev) => ({
      ...prev,
      assignedTo: "",
    }));
  }
}, [form.campaignId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (lead) {
        await updateLead(
          lead._id,
          form
        );
      } else {
        await createLead(form);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#151D2E] p-6 rounded-2xl w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-white mb-6">
          {lead
            ? "Edit Lead"
            : "Create Lead"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          <select
            name="campaignId"
            value={form.campaignId}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
            required
          >
            <option value="">
              Select Campaign
            </option>

            {campaigns.map((c) => (
              <option
                key={c._id}
                value={c._id}
              >
                {c.title}
              </option>
            ))}
          </select>

            <select
  name="assignedTo"
  value={form.assignedTo}
  onChange={handleChange}
  className="p-3 rounded bg-[#1A2340] text-white"
  required
>
  <option value="">
    Assign User
  </option>

  {users
    .filter((u) => {
      const selectedCampaign =
        campaigns.find(
          (c) => c._id === form.campaignId
        );

      if (!selectedCampaign) return false;

      return (
        selectedCampaign.assignedUsers || []
      ).some(
        (assignedUser) =>
          String(
            assignedUser._id ||
            assignedUser
          ) === String(u._id)
      );
    })
    .map((u) => (
      <option
        key={u._id}
        value={u._id}
      >
        {u.firstName} {u.lastName}
      </option>
    ))}
</select>

          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
            required
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
          />

          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
          />

          <input
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            value={form.linkedinUrl}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white col-span-2"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-3 rounded bg-[#1A2340] text-white"
          >
            <option value="new">
              New
            </option>
            <option value="contacted">
              Contacted
            </option>
            <option value="replied">
              Replied
            </option>
            <option value="meeting_booked">
              Meeting Booked
            </option>
            <option value="closed">
              Closed
            </option>
          </select>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-600 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-pink-500 rounded"
            >
              {lead
                ? "Update Lead"
                : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}