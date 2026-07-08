import React from "react";

export default function MailboxSelector({ mailboxes = [], selectedMailboxId, onChange }) {
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
        <p className="text-sm text-gray-400">
          No verified mailboxes found yet. Create one from the backend to enable sending.
        </p>
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
                  <div className="font-semibold text-white">{mailbox.email_address || "Untitled mailbox"}</div>
                  <div className="mt-1 text-sm text-gray-400">
                    {mailbox.label || mailbox.provider || "Gmail mailbox"}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Status: {mailbox.status || "Active"} · Verified: {mailbox.is_verified ? "Yes" : "No"}
                  </div>
                </div>
                <input
                  type="radio"
                  name="selectedMailbox"
                  checked={isSelected}
                  onChange={() => onChange?.(mailbox._id)}
                  className="mt-1 h-4 w-4 accent-cyan-500"
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
