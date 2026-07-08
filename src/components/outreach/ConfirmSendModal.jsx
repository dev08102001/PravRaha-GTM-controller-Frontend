import { useEffect, useState } from "react";
import ContactLocalTime from "./ContactLocalTime";

const MailIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

/*
| Confirmation step before actually sending an outreach email. Lets the user
| review the recipient and edit the destination email address, then confirms
| a real send.
*/
export default function ConfirmSendModal({
  open,
  message,
  sending,
  onClose,
  onConfirm,
}) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open && message) {
      setEmail(message.email || "");
    }
  }, [open, message]);

  if (!open || !message) return null;

  const valid = isValidEmail(email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0E1422] border border-[#2A3550] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-5 bg-gradient-to-r from-cyan-600/20 via-blue-600/10 to-transparent border-b border-[#2A3550]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <MailIcon />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Confirm &amp; Send
                </h2>
                <p className="text-gray-400 text-sm">
                  Review the recipient before the email goes out
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Recipient summary */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center font-bold text-pink-300">
              {message.initials || "?"}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">
                {message.name}
                {message.role ? (
                  <span className="text-gray-400 font-normal">
                    {" "}
                    • {message.role}
                  </span>
                ) : null}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {message.company || "—"}
              </p>
            </div>
          </div>

          {/* Editable email */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Send To (email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              className={`mt-1 w-full bg-[#151D2E] border rounded-lg px-3 py-2 text-white outline-none ${
                email && !valid
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#2A3550] focus:border-cyan-500"
              }`}
            />
            {email && !valid && (
              <p className="text-xs text-red-400 mt-1">
                Enter a valid email address.
              </p>
            )}
          </div>

          {/* Subject preview */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Subject
            </label>
            <div className="mt-1 bg-[#151D2E] border border-[#2A3550] rounded-lg px-3 py-2 text-gray-200 truncate">
              {message.subject || "(no subject)"}
            </div>
          </div>

          {(message.contactCity ||
            message.contactState ||
            message.contactCountry ||
            message.timezone) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {(message.contactCity ||
                message.contactState ||
                message.contactCountry) && (
                <span className="px-2.5 py-1 rounded bg-[#1C2538] text-gray-300 border border-[#2A3550]">
                  📍{" "}
                  {[
                    message.contactCity,
                    message.contactState,
                    message.contactCountry,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
              {message.timezone && (
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">
                  Local now:{" "}
                  <ContactLocalTime timezone={message.timezone || "UTC"} />
                </span>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500">
            You can send anytime. Replace the recipient with a{" "}
            <strong>test email</strong> if you do not want to email the real
            contact.
          </p>

          <p className="text-xs text-gray-500">
            The edited address will be used for this send.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-[#2A3550]">
          <button
            onClick={onClose}
            className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700/40 text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(email.trim())}
            disabled={sending || !valid}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 px-5 py-2 rounded-lg font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {sending ? "Sending..." : "Confirm & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
