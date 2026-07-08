import { useEffect, useState } from "react";

import { sendTestEmail } from "../../services/outreachService";

const SendIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
  </svg>
);

/*
| A small internal utility (Outreach Queue only) to verify real email delivery
| by sending a test email to an address you control. Lets you confirm sending
| works before going live with real contacts.
*/
export default function TestEmailModal({ open, onClose, defaultMessage }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(
    defaultMessage?.subject || "PravRaha test email"
  );
  const [body, setBody] = useState(
    defaultMessage?.body ||
      "This is a test email from PravRaha. If you received this, outreach email delivery is working correctly."
  );
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  // When the modal opens (optionally for a specific message), refresh the
  // subject/body and clear any previous result.
  useEffect(() => {
    if (open) {
      setSubject(defaultMessage?.subject || "PravRaha test email");
      setBody(
        defaultMessage?.body ||
          "This is a test email from PravRaha. If you received this, outreach email delivery is working correctly."
      );
      setResult(null);
    }
  }, [open, defaultMessage]);

  if (!open) return null;

  const handleSend = async () => {
    setResult(null);
    try {
      setSending(true);
      const res = await sendTestEmail({ to, subject, body });
      setResult({ ok: true, message: res?.message || "Test email sent." });
    } catch (error) {
      setResult({
        ok: false,
        message:
          error?.response?.data?.message || "Failed to send test email.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0E1422] border border-[#2A3550] rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-5 bg-gradient-to-r from-emerald-600/20 via-teal-600/10 to-transparent border-b border-[#2A3550]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                <SendIcon />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Send Test Email
                </h2>
                <p className="text-gray-400 text-sm">
                  Verify real delivery to an address you control
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

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Send To (your email)
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full bg-[#151D2E] border border-[#2A3550] rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full bg-[#151D2E] border border-[#2A3550] rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="mt-1 w-full bg-[#151D2E] border border-[#2A3550] rounded-lg px-3 py-2 text-gray-200 leading-7 outline-none focus:border-emerald-500"
            />
          </div>

          {result && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                result.ok
                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                  : "bg-red-500/15 text-red-300 ring-1 ring-red-500/30"
              }`}
            >
              {result.message}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-[#2A3550]">
          <button
            onClick={onClose}
            className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700/40 text-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 px-5 py-2 rounded-lg font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
