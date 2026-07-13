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
} from "../services/outreachService";

const SEQUENCE_LABELS = [
  "Initial Email",
  "Follow-up 1",
  "Follow-up 2",
  "Follow-up 3",
  "Follow-up 4",
  "Follow-up 5",
  "Follow-up 6",
];

const firstNameOf = (name = "") =>
  String(name || "")
    .trim()
    .split(/\s+/)[0] || "there";

const withRePrefix = (subject) => {
  const s = String(subject || "").trim() || "Following up";
  return s.toLowerCase().startsWith("re:") ? s : `Re: ${s}`;
};

const FOLLOW_UP_OPENERS = [
  "I wanted to follow up on my previous email",
  "Just circling back on my note",
  "I know timing can be tricky — bumping this up in case it got buried",
  "Quick nudge in case my earlier note slipped through the cracks",
  "Sharing one last gentle follow-up on this",
  "Final note from me on this thread — happy to close the loop either way",
];

const buildLocalFollowUpBody = (msg, followUpIndex) => {
  const opener =
    FOLLOW_UP_OPENERS[Math.min(followUpIndex, FOLLOW_UP_OPENERS.length - 1)];
  const companyBit = msg.company ? ` regarding ${msg.company}` : "";
  return `Hi ${firstNameOf(msg.name)},

${opener}${companyBit}. I know things get busy, so I wanted to bring this back to the top of your inbox.

Would you be open to a quick chat this week? Happy to work around your schedule.

Best regards,
PravRaha Team`;
};

/** Normalize / backfill a 7-step sequence for UI display. */
const getEmailSequence = (msg) => {
  if (Array.isArray(msg.emailSequence) && msg.emailSequence.length === 7) {
    return msg.emailSequence;
  }

  const initialSubject = msg.subject || "Hello";
  const initialBody = msg.body || "";
  return SEQUENCE_LABELS.map((label, step) => {
    if (step === 0) {
      return {
        step: 0,
        label,
        subject: initialSubject,
        body: initialBody,
        status:
          String(msg.status || "").toUpperCase() === "SENT" ? "SENT" : "PENDING",
      };
    }
    return {
      step,
      label,
      subject: withRePrefix(initialSubject),
      body: buildLocalFollowUpBody(msg, step - 1),
      status: msg.replyReceived || msg.sequenceCancelled ? "CANCELLED" : "PENDING",
    };
  });
};

const stepStatusStyles = (status) => {
  const s = String(status || "PENDING").toUpperCase();
  if (s === "SENT") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  if (s === "CANCELLED") return "bg-red-500/10 text-red-300/80 border-red-500/30";
  if (s === "SCHEDULED")
    return "bg-violet-500/20 text-violet-300 border-violet-500/40";
  if (s === "FAILED") return "bg-red-500/20 text-red-400 border-red-500/40";
  return "bg-[#1C2538] text-gray-300 border-[#2A3550]";
};

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
  const [sendingAll] = useState(false);
  const [sentContact, setSentContact] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState(null);
  // Per-card selected sequence step (0–6). Defaults to Initial Email.
  const [selectedStepById, setSelectedStepById] = useState({});

  const getSelectedStep = (msgId) => selectedStepById[msgId] ?? 0;

  const selectSequenceStep = (msg, stepIndex) => {
    setSelectedStepById((prev) => ({ ...prev, [msg._id]: stepIndex }));
    // If currently editing this card, swap the edit buffers to the new step.
    if (editingId === msg._id) {
      const sequence = getEmailSequence(msg);
      const step = sequence[stepIndex] || sequence[0];
      setEditSubject(step?.subject || "");
      setEditBody(step?.body || "");
    }
  };

  const getActiveStepContent = (msg) => {
    const stepIndex = getSelectedStep(msg._id);
    const sequence = getEmailSequence(msg);
    const step = sequence[stepIndex] || sequence[0];
    return { stepIndex, step, sequence };
  };

  // Approve the message and actually deliver it to the contact.
  const sendMessage = async (id, payload = {}) => {
    try {
      setSendingId(id);
      const res = await sendOutreachMessage(id, payload);

      await queryClient.invalidateQueries({
        queryKey: ["outreach"],
      });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["pipeline-summary"] });

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

  const confirmAndSend = (email) => {
    if (!confirmMsg) return;
    const sequenceStep =
      confirmMsg._sequenceStep ?? getSelectedStep(confirmMsg._id);
    sendMessage(confirmMsg._id, { email, force: true, sequenceStep });
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
    const { step } = getActiveStepContent(msg);
    setEditingId(msg._id);
    setEditSubject(step?.subject || msg.subject || "");
    setEditBody(step?.body || msg.body || "");
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
        sequenceStep: getSelectedStep(id),
      });

      await queryClient.invalidateQueries({
        queryKey: ["outreach"],
      });

      cancelEdit();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to save message");
    } finally {
      setSaving(false);
    }
  };

  const openConfirmSend = (msg) => {
    const { stepIndex, step } = getActiveStepContent(msg);
    if (step?.status === "CANCELLED") {
      alert("This email step was cancelled and cannot be sent.");
      return;
    }
    if (step?.status === "SENT") {
      alert("This email step was already sent.");
      return;
    }
    setConfirmMsg({
      ...msg,
      subject: step?.subject || msg.subject,
      body: step?.body || msg.body,
      _sequenceStep: stepIndex,
      _sequenceLabel: step?.label || SEQUENCE_LABELS[stepIndex],
    });
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <h2 className="text-xl text-white">Loading Messages...</h2>
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
          <h1 className="text-3xl font-bold">Message Approval Queue</h1>

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
          <p className="text-gray-300 font-medium">No messages in the queue</p>
          <p className="text-gray-500 text-sm mt-1">
            {sentMessages.length > 0
              ? "All generated messages have been sent. See Sent Messages below."
              : "Enter a Campaign Goal on the Dashboard and Launch Agents. Outreach drafts are created automatically for real people found in the database."}
          </p>
        </div>
      )}

      {/* Queue — messages not yet sent */}
      {queueMessages.map((msg) => {
        const { stepIndex, step, sequence } = getActiveStepContent(msg);
        const displaySubject =
          editingId === msg._id ? editSubject : step?.subject || msg.subject;
        const displayBody =
          editingId === msg._id ? editBody : step?.body || msg.body;
        const stepCancelled = step?.status === "CANCELLED";
        const stepSent = step?.status === "SENT";

        return (
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
                    msg.channel === "EMAIL" ? "bg-green-600" : "bg-blue-600"
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
                <span className="ml-2 font-normal text-cyan-400/80 normal-case tracking-normal">
                  {step?.label || SEQUENCE_LABELS[stepIndex]}
                </span>
              </h3>

              {editingId === msg._id ? (
                <input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  disabled={stepCancelled || stepSent}
                  className="w-full bg-[#1C2538] border border-[#2A3550] rounded-lg px-3 py-2 font-semibold tracking-wide text-white outline-none focus:border-cyan-500 disabled:opacity-60"
                />
              ) : (
                <div className="font-semibold tracking-wide">{displaySubject}</div>
              )}
            </div>

            {/* Body */}
            {editingId === msg._id ? (
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={6}
                disabled={stepCancelled || stepSent}
                className="w-full bg-[#1C2538] p-5 rounded-lg leading-8 text-gray-200 border border-[#2A3550] outline-none focus:border-cyan-500 disabled:opacity-60"
              />
            ) : (
              <div className="bg-[#1C2538] p-5 rounded-lg whitespace-pre-line leading-8 text-gray-200">
                {displayBody}
              </div>
            )}

            {/* Recipient email */}
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
                Change this to a test address before sending so real contacts are
                not emailed.
              </p>
            </div>

            {/* Context */}
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

            {/* Location + local time */}
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
                      : msg.status === "SENT"
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
                <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
                  ✓ {msg.channel === "LINKEDIN" ? "Message" : "Email"} sent to{" "}
                  {msg.name}
                  {msg.email ? ` (${msg.email})` : ""}
                  {msg.sentAt
                    ? ` • ${new Date(msg.sentAt).toLocaleString()}`
                    : ""}
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  {msg.email
                    ? `✉ ${msg.email}`
                    : msg.linkedinUrl
                      ? `🔗 ${msg.linkedinUrl}`
                      : "No contact channel on file"}
                </span>
              )}
            </div>

            {/* 7-step email sequence — below status, above actions */}
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                Email Sequence
              </p>
              <div className="flex flex-wrap gap-2">
                {sequence.map((seqStep) => {
                  const active = stepIndex === seqStep.step;
                  const status = String(seqStep.status || "PENDING").toUpperCase();
                  return (
                    <button
                      key={seqStep.step}
                      type="button"
                      onClick={() => selectSequenceStep(msg, seqStep.step)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        active
                          ? "bg-cyan-600 text-white border-cyan-500 shadow-sm"
                          : stepStatusStyles(status)
                      } ${!active ? "hover:border-cyan-500/50 hover:text-white" : ""}`}
                      title={`${seqStep.label} — ${status}`}
                    >
                      {seqStep.label}
                      {status !== "PENDING" && (
                        <span className="ml-1 opacity-70">
                          ·{" "}
                          {status === "CANCELLED"
                            ? "Killed"
                            : status.charAt(0) + status.slice(1).toLowerCase()}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {stepCancelled && (
                <p className="text-xs text-red-300/90 mt-2">
                  This step was cancelled after a positive reply. Remaining
                  follow-ups will not be sent.
                </p>
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
                    disabled={saving || stepCancelled || stepSent}
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
                    disabled={stepCancelled || stepSent}
                    className="border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-60"
                  >
                    ✎ Edit
                  </button>

                  <button
                    onClick={() => openConfirmSend(msg)}
                    disabled={
                      sendingId === msg._id ||
                      msg.status === "SENT" ||
                      msg.status === "SCHEDULED" ||
                      stepCancelled ||
                      stepSent
                    }
                    className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg disabled:opacity-60"
                  >
                    {sendingId === msg._id
                      ? "Sending..."
                      : stepSent
                        ? "✓ Sent"
                        : stepCancelled
                          ? "Cancelled"
                          : msg.status === "SCHEDULED"
                            ? "⏳ Scheduled"
                            : `✓ Approve & Send${
                                stepIndex > 0
                                  ? ` (${step?.label || SEQUENCE_LABELS[stepIndex]})`
                                  : ""
                              }`}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Sent messages */}
      {sentMessages.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Sent Messages</h2>
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
                      {msg.replyReceived || msg.sequenceCancelled
                        ? " • Sequence stopped (replied)"
                        : Array.isArray(msg.emailSequence)
                          ? ` • ${msg.emailSequence.filter((s) => s.status === "SENT").length}/7 sent`
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
