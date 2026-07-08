// import { useEffect, useState } from "react";
// import api from "../services/api";

// export default function Outreach() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       setLoading(true);

//       const response = await api.get("/outreach");

//       setMessages(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveMessage = async (id) => {
//     try {
//       await api.put(`/outreach/${id}/approve`);

//       fetchMessages();
//     } catch (error) {
//       console.error(error);

//       alert("Failed to approve message");
//     }
//   };

//   const rejectMessage = async (id) => {
//     try {
//       await api.put(`/outreach/${id}/reject`);

//       fetchMessages();
//     } catch (error) {
//       console.error(error);

//       alert("Failed to reject message");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <h2 className="text-xl text-white">
//           Loading Messages...
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">
//             Message Approval Queue
//           </h1>

//           <p className="text-gray-400 mt-2">
//             {messages.length} messages awaiting your review before launch
//           </p>
//         </div>

//         <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium">
//           ✓ Approve All
//         </button>
//       </div>

//       {/* Messages */}
//       {messages.map((msg) => (
//         <div
//           key={msg._id}
//           className="bg-[#151D2E] border border-[#2A3550] rounded-xl p-6"
//         >
//           {/* Top */}
//           <div className="flex justify-between items-start mb-5">
//             <div className="flex gap-4">
//               <div className="w-12 h-12 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center font-bold text-pink-300">
//                 {msg.initials}
//               </div>

//               <div>
//                 <h2 className="font-bold text-lg">
//                   {msg.name} • {msg.role}
//                 </h2>

//                 <p className="text-gray-400 text-sm">
//                   {msg.company} • Touch Sequence
//                 </p>
//               </div>
//             </div>

//             <div className="text-right">
//               <span
//                 className={`px-3 py-1 rounded text-xs font-semibold ${
//                   msg.channel === "EMAIL"
//                     ? "bg-green-600"
//                     : "bg-blue-600"
//                 }`}
//               >
//                 {msg.channel}
//               </span>

//               <div className="text-green-400 font-bold mt-2">
//                 Score: {msg.score}
//               </div>
//             </div>
//           </div>

//           {/* Subject */}
//           <div className="mb-4">
//             <h3 className="text-gray-400 text-sm mb-2 font-semibold">
//               SUBJECT:
//             </h3>

//             <div className="font-semibold tracking-wide">
//               {msg.subject}
//             </div>
//           </div>

//           {/* Body */}
//           <div className="bg-[#1C2538] p-5 rounded-lg whitespace-pre-line leading-8 text-gray-200">
//             {msg.body}
//           </div>

//           {/* Context */}
//           <div className="mt-4 text-green-400 italic">
//             Signal Context: {msg.context}
//           </div>

//           {/* Status */}
//           <div className="mt-4">
//             <span
//               className={`px-3 py-1 rounded text-xs font-semibold ${
//                 msg.status === "APPROVED"
//                   ? "bg-green-500/20 text-green-400"
//                   : msg.status === "REJECTED"
//                   ? "bg-red-500/20 text-red-400"
//                   : msg.status === "SENT"
//                   ? "bg-cyan-500/20 text-cyan-400"
//                   : "bg-yellow-500/20 text-yellow-400"
//               }`}
//             >
//               {msg.status || "PENDING"}
//             </span>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-wrap gap-3 mt-6">
//             <button
//               onClick={() => rejectMessage(msg._id)}
//               className="border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10"
//             >
//               ✕ Reject
//             </button>

//             <button className="border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-700">
//               ✎ Edit
//             </button>

//             <button
//               onClick={() => approveMessage(msg._id)}
//               className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
//             >
//               ✓ Approve & Send
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useOutreach from "../hooks/queries/useOutreach";
import SendSuccessModal from "../components/outreach/SendSuccessModal";
import ConfirmSendModal from "../components/outreach/ConfirmSendModal";
import ContactLocalTime from "../components/outreach/ContactLocalTime";

import {
  sendOutreachMessage,
  rejectOutreachMessage,
  updateOutreachMessage,
  runDailyOutreach,
} from "../services/outreachService";

export default function Outreach() {
const queryClient = useQueryClient();

const {
  data: messages = [],
  isLoading,
  isError,
} = useOutreach();

const [editingId, setEditingId] = useState(null);
const [editSubject, setEditSubject] = useState("");
const [editBody, setEditBody] = useState("");
const [editEmail, setEditEmail] = useState("");
const [saving, setSaving] = useState(false);
const [sendingId, setSendingId] = useState(null);
const [sendingAll, setSendingAll] = useState(false);
const [sentContact, setSentContact] = useState(null);
const [confirmMsg, setConfirmMsg] = useState(null);

// Approve the message and actually deliver it to the contact.
const sendMessage = async (id, payload = {}) => {
  try {
    setSendingId(id);
    const res = await sendOutreachMessage(id, payload);

    await queryClient.invalidateQueries({
      queryKey: ["outreach"],
    });
    // Refresh campaign stats (Msgs Sent updates on the campaign card).
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    queryClient.invalidateQueries({ queryKey: ["pipeline-summary"] });

    // Close the confirm dialog and celebrate the send or show schedule notice.
    setConfirmMsg(null);
    if (res?.scheduled) {
      alert(
        (res?.message || "Message scheduled.") +
          " Saved in Outreach Status."
      );
      return;
    }
    if (res?.queued) {
      alert(
        (res?.message || "Message queued for the email worker.") +
          " Track progress in Outreach Status."
      );
      return;
    }
    setSentContact(res?.data || messages.find((m) => m._id === id) || null);
  } catch (error) {
    console.error(error);

    // The message no longer exists (e.g. a newer campaign replaced the queue).
    // Refresh so the stale card is removed instead of leaving a dead button.
    if (error?.response?.status === 404) {
      await queryClient.invalidateQueries({ queryKey: ["outreach"] });
      alert("This message is no longer available. The queue has been refreshed.");
    } else {
      alert(error?.response?.data?.message || "Failed to send message");
    }
  } finally {
    setSendingId(null);
  }
};

// Confirm dialog handler: send for real to the (possibly edited) email.
const confirmAndSend = (email) => {
  if (!confirmMsg) return;
  sendMessage(confirmMsg._id, { email, force: true });
};

const rejectMessage = async (id) => {
  try {
    await rejectOutreachMessage(id);

    await queryClient.invalidateQueries({
      queryKey: ["outreach"],
    });
  } catch (error) {
    console.error(error);
    alert("Failed to reject message");
  }
};

const sendAllMessages = async () => {
  alert(
    "Automatic bulk/daily email scheduling is disabled for testing.\n\nEdit each recipient email in the queue, then use Approve & Send on individual messages."
  );
};

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditSubject(msg.subject || "");
    setEditBody(msg.body || "");
    setEditEmail(msg.email || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSubject("");
    setEditBody("");
    setEditEmail("");
  };

  const saveEdit = async (id) => {
    try {
      setSaving(true);

      const email = String(editEmail || "").trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid recipient email address.");
        return;
      }

      await updateOutreachMessage(id, {
        subject: editSubject,
        body: editBody,
        email,
      });

      await queryClient.invalidateQueries({
        queryKey: ["outreach"],
      });

      cancelEdit();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Failed to save message"
      );
    } finally {
      setSaving(false);
    }
  };

  // Queue = messages still awaiting send. Sent = already delivered.
  const queueMessages = messages.filter(
    (m) =>
      !["SENT", "REJECTED", "QUEUED", "SENDING"].includes(
        (m.status || "").toUpperCase()
      )
  );
  const workerMessages = messages.filter((m) =>
    ["QUEUED", "SENDING"].includes((m.status || "").toUpperCase())
  );
  const scheduledMessages = messages.filter((m) => m.status === "SCHEDULED");
  const sentMessages = messages.filter((m) => m.status === "SENT");

  const formatLocation = (msg) => {
    const parts = [msg.contactCity, msg.contactState, msg.contactCountry].filter(
      Boolean
    );
    return parts.length ? parts.join(", ") : null;
  };

  const shortenContext = (text = "", maxLen = 220) => {
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (!clean) return "";
    if (clean.length <= maxLen) return clean;

    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
    const twoLines = sentences.slice(0, 2).join(" ").trim();
    if (twoLines.length <= maxLen) return twoLines;

    const cut = twoLines.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(" ");
    const trimmed =
      lastSpace > Math.floor(maxLen * 0.5) ? cut.slice(0, lastSpace) : cut;
    return `${trimmed.trim()}…`;
  };

   if (isLoading){
    return (
      <div className="flex justify-center items-center h-[400px]">
        <h2 className="text-xl text-white">
          Loading Messages...
        </h2>
      </div>
    );
  }
    if (isError) {
  return (
    <div className="text-red-500 text-xl">
      Failed to load outreach messages
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Message Approval Queue
          </h1>

          <p className="text-gray-400 mt-2">
            {queueMessages.length} message
            {queueMessages.length === 1 ? "" : "s"} awaiting your review before
            launch
            {scheduledMessages.length > 0
              ? ` · ${scheduledMessages.length} scheduled`
              : ""}
            {workerMessages.length > 0
              ? ` · ${workerMessages.length} in worker queue`
              : ""}
          </p>
        </div>

        {queueMessages.length > 0 && (
          <button
            onClick={sendAllMessages}
            disabled={sendingAll}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium disabled:opacity-60"
          >
            {sendingAll ? "Running..." : "✓ Run Today's Outreach (10/day)"}
          </button>
        )}
      </div>

      {/* Empty queue state */}
      {queueMessages.length === 0 && (
        <div className="bg-[#151D2E] border border-dashed border-[#2A3550] rounded-xl p-8 text-center">
          <p className="text-gray-300 font-medium">
            No messages in the queue
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {sentMessages.length > 0
              ? "All generated messages have been sent. See Sent Messages below."
              : "Enter a Campaign Goal on the Dashboard and Launch Agents. Outreach drafts are created automatically for real people found in the database."}
          </p>
        </div>
      )}

      {/* Queue — messages not yet sent */}
      {queueMessages.map((msg) => (
        <div
          key={msg._id}
          className="bg-[#151D2E] border border-[#2A3550] rounded-xl p-6"
        >
          {/* Top */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center font-bold text-pink-300">
                {msg.initials}
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  {msg.name} • {msg.role}
                </h2>

                <p className="text-gray-400 text-sm">
                  {msg.company} • Touch Sequence
                </p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  msg.channel === "EMAIL"
                    ? "bg-green-600"
                    : "bg-blue-600"
                }`}
              >
                {msg.channel}
              </span>

              <div className="text-green-400 font-bold mt-2">
                Score: {msg.score}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <h3 className="text-gray-400 text-sm mb-2 font-semibold">
              SUBJECT:
            </h3>

            {editingId === msg._id ? (
              <input
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full bg-[#1C2538] border border-[#2A3550] rounded-lg px-3 py-2 font-semibold tracking-wide text-white outline-none focus:border-cyan-500"
              />
            ) : (
              <div className="font-semibold tracking-wide">
                {msg.subject}
              </div>
            )}
          </div>

          {/* Body */}
          {editingId === msg._id ? (
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={6}
              className="w-full bg-[#1C2538] p-5 rounded-lg leading-8 text-gray-200 border border-[#2A3550] outline-none focus:border-cyan-500"
            />
          ) : (
            <div className="bg-[#1C2538] p-5 rounded-lg whitespace-pre-line leading-8 text-gray-200">
              {msg.body}
            </div>
          )}

          {/* Recipient email — editable for testing with real contact DB */}
          <div className="mt-4">
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Recipient Email
            </label>
            {editingId === msg._id ? (
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Replace with your test email (e.g. you@example.com)"
                className="mt-1 w-full bg-[#1C2538] border border-[#2A3550] rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            ) : (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-cyan-300 text-sm">
                  {msg.email || "No email on file — edit before sending"}
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(msg)}
                  className="text-xs text-gray-400 hover:text-white underline"
                >
                  Edit email
                </button>
              </div>
            )}
            <p className="text-xs text-amber-400/90 mt-1">
              Change this to a test address before sending so real contacts are not emailed.
            </p>
          </div>

          {/* Context — max two lines */}
          {msg.context && (
            <div className="mt-4 text-sm leading-snug">
              <span className="text-green-500/90 font-medium not-italic">
                Signal Context:
              </span>{" "}
              <span className="text-green-400 italic line-clamp-2">
                {shortenContext(msg.context)}
              </span>
            </div>
          )}

          {/* Location + local time only */}
          {(formatLocation(msg) || msg.timezone) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {formatLocation(msg) && (
                <span className="px-2.5 py-1 rounded bg-[#1C2538] text-gray-300 border border-[#2A3550]">
                  📍 {formatLocation(msg)}
                </span>
              )}
              {msg.timezone && (
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">
                  Local now:{" "}
                  <ContactLocalTime timezone={msg.timezone || "UTC"} />
                </span>
              )}
            </div>
          )}

          {/* Status + delivery info */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 rounded text-xs font-semibold ${
                msg.status === "APPROVED"
                  ? "bg-green-500/20 text-green-400"
                  : msg.status === "REJECTED"
                  ? "bg-red-500/20 text-red-400"
                  :                 msg.status === "SENT"
                  ? "bg-cyan-500/20 text-cyan-400"
                  : msg.status === "SCHEDULED"
                  ? "bg-violet-500/20 text-violet-300"
                  : msg.status === "FAILED"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {msg.status || "PENDING"}
            </span>

            {msg.status === "SENT" ? (
              // Clear confirmation that the message went out to the contact.
              <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
                ✓ {msg.channel === "LINKEDIN" ? "Message" : "Email"} sent to{" "}
                {msg.name}
                {msg.email ? ` (${msg.email})` : ""}
                {msg.sentAt
                  ? ` • ${new Date(msg.sentAt).toLocaleString()}`
                  : ""}
              </span>
            ) : (
              // Where this message will be delivered.
              <span className="text-xs text-gray-400">
                {msg.email
                  ? `✉ ${msg.email}`
                  : msg.linkedinUrl
                  ? `🔗 ${msg.linkedinUrl}`
                  : "No contact channel on file"}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            {editingId === msg._id ? (
              <>
                <button
                  onClick={cancelEdit}
                  className="border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  ✕ Cancel
                </button>

                <button
                  onClick={() => saveEdit(msg._id)}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-60"
                >
                  {saving ? "Saving..." : "💾 Save"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => rejectMessage(msg._id)}
                  className="border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10"
                >
                  ✕ Reject
                </button>

                <button
                  onClick={() => startEdit(msg)}
                  className="border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  ✎ Edit
                </button>

                <button
                  onClick={() => setConfirmMsg(msg)}
                  disabled={
                    sendingId === msg._id ||
                    msg.status === "SENT" ||
                    msg.status === "SCHEDULED"
                  }
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg disabled:opacity-60"
                >
                  {sendingId === msg._id
                    ? "Sending..."
                    : msg.status === "SENT"
                    ? "✓ Sent"
                    : msg.status === "SCHEDULED"
                    ? "⏳ Scheduled"
                    : "✓ Approve & Send"}
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* -------------------------------------------------- */}
      {/* SENT MESSAGES — already delivered, shown compactly */}
      {/* -------------------------------------------------- */}
      {sentMessages.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">
              Sent Messages
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300">
              {sentMessages.length} sent
            </span>
          </div>

          <div className="space-y-3">
            {sentMessages.map((msg) => (
              <div
                key={msg._id}
                className="bg-[#111A2E] border border-[#22304F] rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300">
                    {msg.initials}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {msg.name}
                      <span className="text-gray-400 font-normal">
                        {" "}
                        • {msg.role}
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {msg.company} — {msg.subject}
                    </p>
                    <p className="text-xs text-cyan-300/90 mt-0.5 truncate">
                      ✓ {msg.channel === "LINKEDIN" ? "Message" : "Email"} sent
                      {msg.email ? ` to ${msg.email}` : ""}
                      {msg.sentAt
                        ? ` • ${new Date(msg.sentAt).toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 px-3 py-1 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300">
                  SENT
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <SendSuccessModal
        open={Boolean(sentContact)}
        contact={sentContact}
        onClose={() => setSentContact(null)}
      />

      <ConfirmSendModal
        open={Boolean(confirmMsg)}
        message={confirmMsg}
        sending={sendingId === confirmMsg?._id}
        onClose={() => setConfirmMsg(null)}
        onConfirm={confirmAndSend}
      />
    </div>
  );
}