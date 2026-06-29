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

import {
  sendOutreachMessage,
  rejectOutreachMessage,
  updateOutreachMessage,
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
const [saving, setSaving] = useState(false);
const [sendingId, setSendingId] = useState(null);
const [sendingAll, setSendingAll] = useState(false);
const [sentContact, setSentContact] = useState(null);

// Approve the message and actually deliver it to the contact.
const sendMessage = async (id) => {
  try {
    setSendingId(id);
    const res = await sendOutreachMessage(id);

    await queryClient.invalidateQueries({
      queryKey: ["outreach"],
    });
    // Refresh campaign stats (Msgs Sent updates on the campaign card).
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });

    // Celebrate the send with an attractive confirmation modal.
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
  const pending = messages.filter(
    (m) => m.status !== "SENT" && m.status !== "REJECTED"
  );

  if (pending.length === 0) {
    alert("No messages left to send.");
    return;
  }

  if (
    !window.confirm(
      `Approve & send ${pending.length} message(s) to their contacts?`
    )
  ) {
    return;
  }

  try {
    setSendingAll(true);
    let delivered = 0;
    let skipped = 0;

    for (const msg of pending) {
      try {
        const res = await sendOutreachMessage(msg._id);
        if (res?.delivered) delivered += 1;
        else skipped += 1;
      } catch {
        skipped += 1;
      }
    }

    await queryClient.invalidateQueries({
      queryKey: ["outreach"],
    });
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });

    alert(`Sent ${delivered} message(s). ${skipped} skipped or failed.`);
  } catch (error) {
    console.error(error);
    alert("Failed to send all messages");
  } finally {
    setSendingAll(false);
  }
};

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditSubject(msg.subject || "");
    setEditBody(msg.body || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSubject("");
    setEditBody("");
  };

  const saveEdit = async (id) => {
    try {
      setSaving(true);
      await updateOutreachMessage(id, {
        subject: editSubject,
        body: editBody,
      });

      await queryClient.invalidateQueries({
        queryKey: ["outreach"],
      });

      cancelEdit();
    } catch (error) {
      console.error(error);
      alert("Failed to save message");
    } finally {
      setSaving(false);
    }
  };

  // Queue = messages still awaiting send. Sent = already delivered.
  const queueMessages = messages.filter((m) => m.status !== "SENT");
  const sentMessages = messages.filter((m) => m.status === "SENT");

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
          </p>
        </div>

        {queueMessages.length > 0 && (
          <button
            onClick={sendAllMessages}
            disabled={sendingAll}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium disabled:opacity-60"
          >
            {sendingAll ? "Sending..." : "✓ Approve & Send All"}
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
              : "Launch a campaign from the Dashboard to generate outreach drafts."}
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

          {/* Context */}
          <div className="mt-4 text-green-400 italic">
            Signal Context: {msg.context}
          </div>

          {/* Status + delivery info */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 rounded text-xs font-semibold ${
                msg.status === "APPROVED"
                  ? "bg-green-500/20 text-green-400"
                  : msg.status === "REJECTED"
                  ? "bg-red-500/20 text-red-400"
                  : msg.status === "SENT"
                  ? "bg-cyan-500/20 text-cyan-400"
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
                  onClick={() => sendMessage(msg._id)}
                  disabled={sendingId === msg._id || msg.status === "SENT"}
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg disabled:opacity-60"
                >
                  {sendingId === msg._id
                    ? "Sending..."
                    : msg.status === "SENT"
                    ? "✓ Sent"
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
    </div>
  );
}