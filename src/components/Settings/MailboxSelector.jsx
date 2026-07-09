import React from "react";
import axios from "axios";

export default function MailboxSelector({
  mailboxes = [],
  selectedMailboxId,
  onChange,
}) {
  const connectGoogle = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:9077/api/mailboxes/google/connect",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect Gmail.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">📧 Mailbox Selection</h2>
          <p className="text-sm text-gray-400 mt-1">
            Choose the mailbox that should be used for outbound sends.
          </p>
        </div>
      </div>

      {mailboxes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-5">
            No Gmail account connected yet.
          </p>

          <button
            onClick={connectGoogle}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 font-medium transition"
          >
            Connect Gmail
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {mailboxes.map((mailbox) => {
            const isSelected = String(selectedMailboxId || "") === String(mailbox._id || "");

            return (
              <label
                key={mailbox._id}
                className={`flex cursor-pointer items-start justify-between rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-700 bg-slate-900/40"
                }`}
              >
                <div className="pr-4">
                  <div className="font-semibold">
                    {mailbox.email_address}
                  </div>

                  <div className="text-sm text-gray-400 mt-1">
                    {mailbox.label || mailbox.provider}
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Status: {mailbox.status} • Verified:{" "}
                    {mailbox.is_verified ? "Yes" : "No"}
                  </div>
                </div>

                <input
                  type="radio"
                  checked={isSelected}
                  name="selectedMailbox"
                  onChange={() => onChange(mailbox._id)}
                  className="mt-1 h-4 w-4 accent-cyan-500"
                />
              </label>
            );
          })}

          <button
            onClick={connectGoogle}
            className="w-full mt-4 rounded-lg border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white py-2 transition"
          >
            + Connect Another Gmail
          </button>
        </div>
      )}
    </div>
  );
}
