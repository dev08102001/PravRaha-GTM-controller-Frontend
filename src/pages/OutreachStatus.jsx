import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useOutreach from "../hooks/queries/useOutreach";
import { sendFollowUp, markReplied } from "../services/outreachService";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Derive the live follow-up state from a message + the current time.
const deriveFollowUp = (msg, now) => {
  if (msg.replyReceived) {
    return { key: "REPLIED", label: "Replied", ready: false };
  }

  const status = (msg.status || "").toUpperCase();
  if (status === "SCHEDULED") {
    return { key: "SCHEDULED", label: "Scheduled", ready: false };
  }
  if (status === "QUEUED" || status === "SENDING") {
    return { key: "QUEUED", label: status === "SENDING" ? "Sending" : "In Queue", ready: false };
  }

  const next = msg.nextFollowUpTime
    ? new Date(msg.nextFollowUpTime).getTime()
    : 0;

  if (!next || now >= next) {
    return { key: "READY", label: "Ready", ready: true };
  }

  return { key: "WAITING", label: "Waiting for Response", ready: false };
};

const isTrackedOutreach = (m) => {
  const status = (m.status || "").toUpperCase();
  const hasEmail =
    Boolean(m.email) || (m.channel || "").toUpperCase() === "EMAIL";
  const approved =
    Boolean(m.approvedAt) ||
    Boolean(m.sentAt) ||
    [
      "Sent",
      "Scheduled",
      "Queued",
      "Sending",
      "Follow-up Queued",
      "Follow-up Sending",
      "Follow-up Sent",
      "Follow-up Scheduled",
      "Replied",
    ].includes(m.followUpStatus);
  return (
    hasEmail &&
    ["SENT", "SCHEDULED", "QUEUED", "SENDING", "FAILED"].includes(status) &&
    approved
  );
};

// Format a millisecond gap as "18h 32m" (or "12m" / "Ready now").
const formatCountdown = (ms) => {
  if (ms <= 0) return "Ready now";

  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const firstNameOf = (name = "") => name.trim().split(/\s+/)[0] || "there";

const getNextSequenceFollowUp = (msg) => {
  const sequence = Array.isArray(msg.emailSequence) ? msg.emailSequence : [];
  return sequence.find(
    (s) =>
      s.step > 0 &&
      ["PENDING", "SCHEDULED", "FAILED"].includes(
        String(s.status || "").toUpperCase()
      )
  );
};

// Prefer the next pending step from the 7-email sequence when available.
const buildFollowUpDraft = (msg) => {
  const next = getNextSequenceFollowUp(msg);
  if (next) {
    return {
      subject: next.subject,
      body: next.body,
      sequenceStep: next.step,
      label: next.label || `Follow-up ${next.step}`,
    };
  }

  const subject = msg.subject
    ? msg.subject.toLowerCase().startsWith("re:")
      ? msg.subject
      : `Re: ${msg.subject}`
    : "Re: Following up";

  const count = msg.followUpCount || 0;
  const opener =
    count === 0
      ? "I wanted to follow up on my previous email"
      : "Just circling back on my note";

  const body = `Hi ${firstNameOf(msg.name)},

${opener}${msg.company ? ` regarding ${msg.company}` : ""}. I know things get busy, so I wanted to bring this back to the top of your inbox.

Would you be open to a quick chat this week? Happy to work around your schedule.

Best regards`;

  return {
    subject,
    body,
    sequenceStep: count + 1,
    label: `Follow-up ${count + 1}`,
  };
};

// Deterministic avatar gradient per contact for a bit of colour variety.
const AVATAR_GRADIENTS = [
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-violet-600",
];
const gradientFor = (seed = "") => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
};

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */

const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {path}
  </svg>
);

const icons = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
};

/* ------------------------------------------------------------------ */
/* Stat card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, icon, gradient, ring, text, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left overflow-hidden rounded-2xl border bg-[#10182B] p-5 transition-all duration-200 hover:-translate-y-0.5 ${ring} ${
        active
          ? "border-white/40 ring-2 ring-white/30 -translate-y-0.5"
          : "border-[#22304F]"
      }`}
    >
      {/* soft corner glow */}
      <div
        className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${gradient} ${
          active ? "opacity-40" : "opacity-20"
        } blur-2xl`}
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            {label}
          </p>
          <h3 className={`text-3xl font-extrabold mt-2 ${text}`}>{value}</h3>
        </div>

        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
        >
          <Icon path={icon} />
        </div>
      </div>

      {/* active underline accent */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} transition-all duration-300 ${
          active ? "w-full" : "w-0"
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Follow-up composer                                                 */
/* ------------------------------------------------------------------ */

function FollowUpComposer({ msg, onClose, onSent }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sequenceStep, setSequenceStep] = useState(null);
  const [stepLabel, setStepLabel] = useState("Follow-up");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (msg) {
      const draft = buildFollowUpDraft(msg);
      setSubject(draft.subject);
      setBody(draft.body);
      setSequenceStep(draft.sequenceStep);
      setStepLabel(draft.label || "Follow-up");
    }
  }, [msg]);

  if (!msg) return null;

  const handleSend = async () => {
    try {
      setSending(true);
      await sendFollowUp(msg._id, { subject, body, sequenceStep });
      onSent();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to send follow-up email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0E1422] border border-[#2A3550] rounded-2xl shadow-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="relative p-5 bg-gradient-to-r from-cyan-600/20 via-blue-600/10 to-transparent border-b border-[#2A3550]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Icon path={icons.mail} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Send {stepLabel}
                </h2>
                <p className="text-gray-400 text-sm">
                  Follow-up #{(msg.followUpCount || 0) + 1} • same thread
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
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              To
            </label>
            <div className="mt-1 flex items-center gap-2 bg-[#151D2E] border border-[#2A3550] rounded-lg px-3 py-2 text-gray-300">
              <span className="text-gray-500">
                <Icon path={icons.mail} className="w-4 h-4" />
              </span>
              {msg.name}
              {msg.email ? ` • ${msg.email}` : ""}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full bg-[#151D2E] border border-[#2A3550] rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500">
              Email Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              className="mt-1 w-full bg-[#151D2E] border border-[#2A3550] rounded-lg px-3 py-2 text-gray-200 leading-7 outline-none focus:border-cyan-500"
            />
          </div>
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
            onClick={handleSend}
            disabled={sending}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 px-5 py-2 rounded-lg font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Follow-up"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function OutreachStatus() {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading, isError } = useOutreach();

  const [composerMsg, setComposerMsg] = useState(null);
  const [replyingId, setReplyingId] = useState(null);

  // Which stat card is selected. "ALL" = every sent email.
  const [filter, setFilter] = useState("ALL");

  // Live clock so the countdowns tick and the "Ready" state unlocks on time.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const sentEmails = useMemo(
    () =>
      messages
        .filter(isTrackedOutreach)
        .sort(
          (a, b) =>
            new Date(b.approvedAt || b.sentAt || 0) -
            new Date(a.approvedAt || a.sentAt || 0)
        ),
    [messages]
  );

  const stats = useMemo(() => {
    const total = sentEmails.length;
    const replied = sentEmails.filter((m) => m.replyReceived).length;
    const awaiting = sentEmails.filter(
      (m) =>
        !m.replyReceived &&
        (m.status || "").toUpperCase() === "SENT" &&
        now < new Date(m.nextFollowUpTime || 0).getTime()
    ).length;
    const ready = sentEmails.filter(
      (m) =>
        !m.replyReceived &&
        (m.status || "").toUpperCase() === "SENT" &&
        now >= new Date(m.nextFollowUpTime || 0).getTime()
    ).length;

    return { total, replied, awaiting, ready };
  }, [sentEmails, now]);

  // Rows shown in the table, narrowed by the selected stat card.
  const visibleEmails = useMemo(() => {
    if (filter === "ALL") return sentEmails;

    return sentEmails.filter((m) => {
      const fu = deriveFollowUp(m, now);
      if (filter === "AWAITING") return fu.key === "WAITING";
      if (filter === "READY") return fu.key === "READY";
      if (filter === "REPLIED") return fu.key === "REPLIED";
      if (filter === "SCHEDULED") return fu.key === "SCHEDULED";
      if (filter === "QUEUED") return fu.key === "QUEUED";
      return true;
    });
  }, [sentEmails, filter, now]);

  // Toggle a filter: clicking the active card again resets to "ALL".
  const toggleFilter = (key) =>
    setFilter((prev) => (prev === key ? "ALL" : key));

  const FILTER_LABELS = {
    ALL: "All outreach emails",
    AWAITING: "Awaiting reply",
    READY: "Follow-up ready",
    REPLIED: "Replied",
    SCHEDULED: "Scheduled for delivery",
    QUEUED: "In worker queue",
  };

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["outreach"] });

  const handleReply = async (id) => {
    try {
      setReplyingId(id);
      const res = await markReplied(id);
      await refresh();
      const cancelled = res?.cancelled;
      if (cancelled > 0) {
        alert(
          `Marked as replied. ${cancelled} remaining sequence email(s) cancelled.`
        );
      }
    } catch (error) {
      console.error(error);
      alert("Failed to mark as replied");
    } finally {
      setReplyingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <h2 className="text-xl text-white">Loading outreach status...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-xl">
        Failed to load outreach status
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Emails Sent"
          value={stats.total}
          icon={icons.mail}
          gradient="from-cyan-500 to-blue-600"
          ring="hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.5)]"
          text="text-cyan-300"
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        />
        <StatCard
          label="Awaiting Reply"
          value={stats.awaiting}
          icon={icons.clock}
          gradient="from-amber-500 to-yellow-600"
          ring="hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.5)]"
          text="text-yellow-300"
          active={filter === "AWAITING"}
          onClick={() => toggleFilter("AWAITING")}
        />
        <StatCard
          label="Follow-up Ready"
          value={stats.ready}
          icon={icons.bolt}
          gradient="from-orange-500 to-red-500"
          ring="hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.5)]"
          text="text-orange-300"
          active={filter === "READY"}
          onClick={() => toggleFilter("READY")}
        />
        <StatCard
          label="Replied"
          value={stats.replied}
          icon={icons.check}
          gradient="from-emerald-500 to-green-600"
          ring="hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)]"
          text="text-emerald-300"
          active={filter === "REPLIED"}
          onClick={() => toggleFilter("REPLIED")}
        />
      </div>

      {/* Empty state */}
      {sentEmails.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#2A3550] bg-[#10182B] p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-4">
            <Icon path={icons.mail} className="w-7 h-7" />
          </div>
          <p className="text-gray-200 font-semibold text-lg">
            No emails sent yet
          </p>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            Run today&apos;s outreach from the Outreach Queue, or approve &amp;
            send individual messages. Approved emails appear here for follow-up
            tracking (10 new contacts per day + daily follow-ups).
          </p>
        </div>
      )}

      {/* Active filter indicator */}
      {sentEmails.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Showing:</span>
            <span className="px-3 py-1 rounded-full bg-[#192540] text-white font-semibold ring-1 ring-[#2A3550]">
              {FILTER_LABELS[filter]}
            </span>
            <span className="text-gray-500">
              ({visibleEmails.length}{" "}
              {visibleEmails.length === 1 ? "result" : "results"})
            </span>
          </div>

          {filter !== "ALL" && (
            <button
              onClick={() => setFilter("ALL")}
              className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Clear filter ×
            </button>
          )}
        </div>
      )}

      {/* Follow-up dashboard table */}
      {sentEmails.length > 0 && (
        <div className="rounded-2xl border border-[#22304F] bg-[#10182B] overflow-hidden shadow-xl">
          {visibleEmails.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No emails in “{FILTER_LABELS[filter]}”.
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-gray-400 bg-[#0C1424] border-b border-[#22304F]">
                  <th className="px-4 py-4 font-semibold">Batch</th>
                  <th className="px-4 py-4 font-semibold">Contact</th>
                  <th className="px-4 py-4 font-semibold">Company</th>
                  <th className="px-4 py-4 font-semibold">Email</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Sent At</th>
                  <th className="px-4 py-4 font-semibold">Follow-up</th>
                  <th className="px-4 py-4 font-semibold">Next Follow-up</th>
                  <th className="px-4 py-4 font-semibold text-center">Count</th>
                  <th className="px-4 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleEmails.map((msg) => {
                  const fu = deriveFollowUp(msg, now);
                  const nextMs = msg.nextFollowUpTime
                    ? new Date(msg.nextFollowUpTime).getTime() - now
                    : 0;

                  const overallStatus =
                    msg.followUpStatus ||
                    (msg.followUpCount > 0 ? "Follow-up Sent" : "Sent");

                  const rowHighlight =
                    fu.key === "READY"
                      ? "bg-orange-500/[0.04]"
                      : fu.key === "REPLIED"
                      ? "bg-emerald-500/[0.03]"
                      : fu.key === "SCHEDULED"
                      ? "bg-violet-500/[0.03]"
                      : fu.key === "QUEUED"
                      ? "bg-cyan-500/[0.03]"
                      : "";

                  return (
                    <tr
                      key={msg._id}
                      className={`border-b border-[#192540] last:border-0 hover:bg-[#16203A] transition align-middle ${rowHighlight}`}
                    >
                      {/* Batch */}
                      <td className="px-4 py-4 text-gray-400 text-sm whitespace-nowrap">
                        {msg.outreachBatch ? `#${msg.outreachBatch}` : "—"}
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br ${gradientFor(
                              msg.name || msg.email
                            )} flex items-center justify-center font-bold text-white text-sm shadow`}
                          >
                            {msg.initials || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">
                              {msg.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {msg.role || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-4 text-gray-300">
                        {msg.company || "—"}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 text-gray-400 text-sm max-w-[190px] truncate">
                        {msg.email || msg.deliveredTo || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            msg.replyReceived
                              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                              : msg.followUpCount > 0
                              ? "bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30"
                              : "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                          }`}
                        >
                          {overallStatus}
                        </span>
                      </td>

                      {/* Sent At */}
                      <td className="px-4 py-4 text-gray-400 text-sm whitespace-nowrap">
                        {msg.status === "SCHEDULED" && msg.scheduledSendLabel
                          ? msg.scheduledSendLabel
                          : msg.sentAt
                          ? new Date(msg.sentAt).toLocaleString()
                          : msg.approvedAt
                          ? new Date(msg.approvedAt).toLocaleString()
                          : "—"}
                      </td>

                      {/* Follow-up status */}
                      <td className="px-4 py-4">
                        {fu.key === "SCHEDULED" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                            <span className="w-2 h-2 rounded-full bg-violet-400" />
                            Awaiting delivery
                          </span>
                        ) : fu.key === "QUEUED" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            {fu.label}
                          </span>
                        ) : fu.key === "REPLIED" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Replied
                          </span>
                        ) : fu.key === "READY" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
                            </span>
                            Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-400">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            Waiting
                          </span>
                        )}
                      </td>

                      {/* Next follow-up countdown */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {msg.replyReceived || fu.key === "SCHEDULED" || fu.key === "QUEUED" ? (
                          <span className="text-gray-500 text-sm">—</span>
                        ) : fu.ready ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-500/15 text-orange-300">
                            <Icon
                              path={icons.bolt}
                              className="w-3.5 h-3.5"
                            />
                            Ready now
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#192540] text-gray-300">
                            <Icon
                              path={icons.clock}
                              className="w-3.5 h-3.5"
                            />
                            {formatCountdown(nextMs)}
                          </span>
                        )}
                      </td>

                      {/* Count */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-[#192540] text-gray-200 font-semibold text-sm">
                          {msg.followUpCount || 0}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4">
                        {fu.key === "SCHEDULED" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30">
                            Queued
                          </span>
                        ) : fu.key === "QUEUED" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
                            Worker processing
                          </span>
                        ) : msg.replyReceived ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                            <Icon path={icons.check} className="w-4 h-4" />
                            Replied
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => setComposerMsg(msg)}
                              disabled={!fu.ready}
                              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                fu.ready
                                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white shadow-md shadow-cyan-500/20"
                                  : "bg-[#192540] text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              {fu.ready ? (
                                <>
                                  <Icon
                                    path={icons.mail}
                                    className="w-3.5 h-3.5"
                                  />
                                  Send Follow-up
                                </>
                              ) : (
                                "Waiting for Response"
                              )}
                            </button>

                            <button
                              onClick={() => handleReply(msg._id)}
                              disabled={replyingId === msg._id}
                              className="text-[11px] text-gray-500 hover:text-emerald-400 transition disabled:opacity-60"
                            >
                              {replyingId === msg._id
                                ? "Saving..."
                                : "Mark as replied"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* Follow-up composer modal */}
      <FollowUpComposer
        msg={composerMsg}
        onClose={() => setComposerMsg(null)}
        onSent={async () => {
          setComposerMsg(null);
          await refresh();
          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        }}
      />
    </div>
  );
}
