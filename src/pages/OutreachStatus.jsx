import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useOutreach from "../hooks/queries/useOutreach";
import {
  sendFollowUp,
  markReplied,
  syncOutreachReplies,
  getOutreachReplies,
  deleteOutreachMessage,
} from "../services/outreachService";
import TiptapEditor from "./TiptapEditor";
import OutreachDetailsDrawer from "../components/outreach/OutreachDetailsDrawer";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/*
| Single source of truth for the 4 Outreach Status cards and the table filter.
| REPLIED / AWAITING / READY partition SENT outreach; other statuses stay under
| Emails Sent only.
*/
const isReplied = (msg) =>
  Boolean(
    msg?.replyReceived ||
      msg?.sequenceCancelled ||
      String(msg?.followUpStatus || "").toLowerCase() === "replied"
  );

const getSectionKey = (msg, now = Date.now()) => {
  if (isReplied(msg)) return "REPLIED";

  const status = (msg.status || "").toUpperCase();
  if (status === "SCHEDULED") return "SCHEDULED";
  if (status === "QUEUED" || status === "SENDING") return "QUEUED";
  if (status === "FAILED") return "FAILED";

  const next = msg.nextFollowUpTime
    ? new Date(msg.nextFollowUpTime).getTime()
    : 0;

  if (next && now < next) return "AWAITING";
  return "READY";
};

const deriveFollowUp = (msg, now) => {
  const key = getSectionKey(msg, now);
  if (key === "REPLIED") return { key: "REPLIED", label: "Replied", ready: false };
  if (key === "SCHEDULED") return { key: "SCHEDULED", label: "Scheduled", ready: false };
  if (key === "QUEUED") {
    const status = (msg.status || "").toUpperCase();
    return {
      key: "QUEUED",
      label: status === "SENDING" ? "Sending" : "In Queue",
      ready: false,
    };
  }
  if (key === "AWAITING") {
    return { key: "WAITING", label: "Waiting for Response", ready: false };
  }
  return { key: "READY", label: "Ready", ready: true };
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

const stripHtml = (htmlOrText = "") => {
  const raw = String(htmlOrText || "");
  if (!raw) return "";
  if (!/<\/?[a-z][\s\S]*>/i.test(raw)) return raw.trim();
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const replySnippet = (msg) => {
  const text =
    stripHtml(msg?.replyBody || msg?.replyPreview || msg?.replySubject || "") ||
    "";
  if (!text) return "";
  return text.length > 140 ? `${text.slice(0, 140).trim()}…` : text;
};

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

Thanks,
`;

  return {
    subject,
    body,
    sequenceStep: count + 1,
    label: `Follow-up ${count + 1}`,
  };
};

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
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
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

      <div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} transition-all duration-300 ${
          active ? "w-full" : "w-0"
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Reply viewer — loads real saved replies from MongoDB                */
/* ------------------------------------------------------------------ */

function ReplyViewer({ msg, onClose }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!msg?._id) return undefined;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOutreachReplies(msg._id);
        if (cancelled) return;
        setReplies(Array.isArray(data?.replies) ? data.replies : []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Failed to load saved replies"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [msg?._id]);

  if (!msg) return null;

  const fallbackBody =
    stripHtml(msg.replyBody || msg.replyPreview || "") || "";
  const showFallback =
    !loading && !error && replies.length === 0 && Boolean(fallbackBody);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0E1422] border border-[#2A3550] rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-5 bg-gradient-to-r from-emerald-600/20 via-green-600/10 to-transparent border-b border-[#2A3550]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <Icon path={icons.inbox} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white truncate">
                  Reply from {msg.name || "contact"}
                </h2>
                <p className="text-gray-400 text-sm truncate">
                  {msg.email || msg.deliveredTo || "—"}
                  {msg.replyReceivedAt
                    ? ` • ${new Date(msg.replyReceivedAt).toLocaleString()}`
                    : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading && (
            <p className="text-gray-400 text-sm py-8 text-center">
              Loading replies from database…
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && replies.length === 0 && !showFallback && (
            <div className="rounded-xl border border-dashed border-[#2A3550] px-4 py-10 text-center">
              <p className="text-gray-300 font-medium">No reply content yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Gmail sync will save the full reply here once it arrives.
              </p>
            </div>
          )}

          {showFallback && (
            <article className="rounded-xl border border-emerald-500/25 bg-[#121A2B] p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                <span className="text-emerald-300 font-medium">
                  {msg.replyFrom || msg.email || "Contact"}
                </span>
                {msg.replyReceivedAt && (
                  <span>{new Date(msg.replyReceivedAt).toLocaleString()}</span>
                )}
              </div>
              {msg.replySubject && (
                <h3 className="text-white font-semibold">{msg.replySubject}</h3>
              )}
              <p className="text-gray-200 text-[15px] leading-7 whitespace-pre-line">
                {fallbackBody}
              </p>
            </article>
          )}

          {replies.map((reply) => {
            const body =
              stripHtml(reply.bodyText || reply.bodyHtml || reply.snippet) ||
              "(empty body)";
            return (
              <article
                key={reply._id}
                className="rounded-xl border border-emerald-500/25 bg-[#121A2B] p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                  <span className="text-emerald-300 font-medium">
                    {reply.fromName || reply.fromEmail || "Contact"}
                    {reply.fromEmail ? ` <${reply.fromEmail}>` : ""}
                  </span>
                  <span>
                    {reply.repliedAt
                      ? new Date(reply.repliedAt).toLocaleString()
                      : reply.createdAt
                        ? new Date(reply.createdAt).toLocaleString()
                        : ""}
                  </span>
                </div>
                {reply.subject && (
                  <h3 className="text-white font-semibold">{reply.subject}</h3>
                )}
                <p className="text-gray-200 text-[15px] leading-7 whitespace-pre-line">
                  {body}
                </p>
              </article>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-[#2A3550]">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700/40 text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
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
      toast.error(
        error?.response?.data?.message || "Failed to send follow-up email"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0E1422] border border-[#2A3550] rounded-2xl shadow-2xl overflow-hidden">
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
              type="button"
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
            <div className="mt-1 rounded-lg border border-[#2A3550] overflow-hidden">
              <TiptapEditor value={body} onChange={setBody} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-[#2A3550]">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700/40 text-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
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

/*
| Undo toast with a live 10 → 0 countdown and progress bar.
| Owns its own timer so the number ticks every second.
*/
const UNDO_WINDOW_MS = 10_000;

function UndoDeleteToast({ visible, name, startedAt, onUndo }) {
  const [msLeft, setMsLeft] = useState(UNDO_WINDOW_MS);

  useEffect(() => {
    const tick = () =>
      setMsLeft(Math.max(0, UNDO_WINDOW_MS - (Date.now() - startedAt)));
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [startedAt]);

  const seconds = Math.ceil(msLeft / 1000);
  const fraction = msLeft / UNDO_WINDOW_MS;

  // Circular countdown ring (SVG stroke drains as time runs out).
  const R = 15;
  const CIRC = 2 * Math.PI * R;

  return (
    <div
      className={`w-[340px] overflow-hidden rounded-2xl border border-[#2A3550] bg-[#0E1626] shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8)] ring-1 ring-red-500/20 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
      }`}
    >
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        {/* Countdown ring */}
        <div className="relative w-11 h-11 shrink-0">
          <svg viewBox="0 0 38 38" className="w-11 h-11 -rotate-90">
            <circle
              cx="19"
              cy="19"
              r={R}
              fill="none"
              stroke="#22304F"
              strokeWidth="3.5"
            />
            <circle
              cx="19"
              cy="19"
              r={R}
              fill="none"
              stroke={seconds <= 3 ? "#f87171" : "#fbbf24"}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - fraction)}
              style={{ transition: "stroke-dashoffset 100ms linear, stroke 300ms" }}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold tabular-nums ${
              seconds <= 3 ? "text-red-300" : "text-amber-300"
            }`}
          >
            {seconds}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">
            {name ? `${name} deleted` : "Outreach deleted"}
          </p>
          <p className="text-xs text-gray-400">
            Removing from database in{" "}
            <span
              className={`font-bold tabular-nums ${
                seconds <= 3 ? "text-red-300" : "text-amber-300"
              }`}
            >
              {seconds}s
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onUndo}
          className="shrink-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/25 hover:opacity-90 active:scale-95 transition"
        >
          ↩ Undo
        </button>
      </div>

      {/* Draining progress bar */}
      <div className="h-1 w-full bg-[#141D33]">
        <div
          className={`h-full ${
            seconds <= 3
              ? "bg-gradient-to-r from-red-500 to-rose-500"
              : "bg-gradient-to-r from-amber-400 to-orange-500"
          }`}
          style={{
            width: `${fraction * 100}%`,
            transition: "width 100ms linear",
          }}
        />
      </div>
    </div>
  );
}

function DeleteConfirmModal({ message, deleting, onCancel, onConfirm }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0B1120] shadow-[0_0_60px_-15px_rgba(239,68,68,0.4)] overflow-hidden">
        {/* Header */}
        <div className="relative p-5 border-b border-[#2A3550] bg-gradient-to-r from-red-600/20 via-rose-600/10 to-transparent">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br from-red-500/25 to-rose-600/25 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-xl text-white shadow-lg shadow-red-500/30">
              🗑
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white">Delete this outreach?</h2>
              <p className="text-sm text-gray-400 truncate">
                {message.name || "Unknown contact"}
                {message.company ? ` · ${message.company}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Contact snapshot */}
          <div className="flex items-center gap-3 rounded-xl border border-[#22304F] bg-[#0E1626] px-3.5 py-3">
            <div
              className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br ${gradientFor(
                message.name || message.email
              )} flex items-center justify-center font-bold text-white text-sm shadow`}
            >
              {message.initials || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {message.name || "—"}
              </p>
              <p className="text-xs text-cyan-300/90 truncate">
                {message.email || message.deliveredTo || "no email"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3.5 py-3">
            <p className="text-xs leading-5 text-gray-300">
              This removes the outreach along with its{" "}
              <span className="text-red-300 font-medium">email history</span>,{" "}
              <span className="text-red-300 font-medium">saved replies</span>{" "}
              and{" "}
              <span className="text-red-300 font-medium">pending email jobs</span>{" "}
              from the database.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-3.5 py-2.5">
            <span className="text-amber-300 text-base">⏱</span>
            <p className="text-xs text-amber-200/90">
              You'll get <span className="font-bold text-amber-300">10 seconds to undo</span>{" "}
              before it's permanently deleted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-[#2A3550] bg-[#0C1424]/80">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="border border-gray-600 px-4 py-2 rounded-lg text-sm text-gray-200 hover:bg-gray-700/40 disabled:opacity-50 transition"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 active:scale-[0.98] px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg shadow-red-500/25 disabled:opacity-60 transition"
          >
            {deleting ? "Deleting…" : "Delete outreach"}
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
  const [replyViewerMsg, setReplyViewerMsg] = useState(null);
  const [detailsId, setDetailsId] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(() => new Set());
  const pendingDeletesRef = useRef(new Map());
  const [replyingId, setReplyingId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const deleteMutation = useMutation({
    mutationFn: async ({ id }) => {
      try {
        return await deleteOutreachMessage(id);
      } catch (error) {
        // If it was removed directly in MongoDB, treat the desired state as
        // achieved instead of restoring a stale row in the UI.
        if (error?.response?.status === 404) return { alreadyDeleted: true };
        throw error;
      }
    },
    onError: (error, { id, deletedMessage, index }) => {
      setPendingDeleteIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      if (deletedMessage) {
        queryClient.setQueryData(["outreach"], (old = []) => {
          if (old.some((message) => message._id === deletedMessage._id)) {
            return old;
          }
          const restored = [...old];
          restored.splice(
            Math.max(0, Math.min(index, restored.length)),
            0,
            deletedMessage
          );
          return restored;
        });
      }
      toast.error(
        error?.response?.data?.message || "Failed to delete outreach message"
      );
    },
    onSuccess: (_result, { id }) => {
      queryClient.setQueryData(["outreach"], (old = []) =>
        old.filter((message) => message._id !== id)
      );
      queryClient.removeQueries({ queryKey: ["outreach-details", id] });
      setPendingDeleteIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      toast.success("Outreach deleted from status and database");
    },
    onSettled: () => {
      // No full-list refetch: cache already reflects the database mutation.
      // The existing periodic outreach query also removes records deleted
      // directly from MongoDB.
    },
  });

  const restorePendingDelete = (id) => {
    const pending = pendingDeletesRef.current.get(id);
    if (!pending) return;

    clearTimeout(pending.timer);
    pendingDeletesRef.current.delete(id);
    toast.dismiss(pending.toastId);
    setPendingDeleteIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });

    queryClient.setQueryData(["outreach"], (old = []) => {
      if (old.some((message) => message._id === id)) return old;
      const restored = [...old];
      restored.splice(
        Math.max(0, Math.min(pending.index, restored.length)),
        0,
        pending.message
      );
      return restored;
    });
    toast.success("Outreach restored");
  };

  const stageDelete = async (message) => {
    const id = message?._id;
    if (!id || pendingDeletesRef.current.has(id)) return;

    await queryClient.cancelQueries({ queryKey: ["outreach"] });
    const current = queryClient.getQueryData(["outreach"]) || [];
    const index = current.findIndex((item) => item._id === id);
    const deletedMessage = index >= 0 ? current[index] : message;

    setDeleteCandidate(null);
    setPendingDeleteIds((ids) => new Set(ids).add(id));
    queryClient.setQueryData(["outreach"], (old = []) =>
      old.filter((item) => item._id !== id)
    );

    if (detailsId === id) setDetailsId(null);
    if (replyViewerMsg?._id === id) setReplyViewerMsg(null);
    if (composerMsg?._id === id) setComposerMsg(null);

    const startedAt = Date.now();
    const toastId = toast.custom(
      (t) => (
        <UndoDeleteToast
          visible={t.visible}
          name={deletedMessage?.name || deletedMessage?.email || ""}
          startedAt={startedAt}
          onUndo={() => restorePendingDelete(id)}
        />
      ),
      { duration: UNDO_WINDOW_MS, position: "bottom-center" }
    );

    const timer = setTimeout(() => {
      pendingDeletesRef.current.delete(id);
      toast.dismiss(toastId);
      deleteMutation.mutate({
        id,
        deletedMessage,
        index: Math.max(index, 0),
      });
    }, UNDO_WINDOW_MS);

    pendingDeletesRef.current.set(id, {
      message: deletedMessage,
      index: Math.max(index, 0),
      toastId,
      timer,
    });
  };

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // Background Gmail reply sync — updates Replied when mail arrives.
  useEffect(() => {
    let cancelled = false;

    const runSync = async () => {
      try {
        const result = await syncOutreachReplies({ silent: true });
        if (cancelled) return;
        const newly = Number(result?.replied || 0);
        const saved = Number(result?.saved || 0);
        if (newly > 0 || saved > 0) {
          await queryClient.invalidateQueries({ queryKey: ["outreach"] });
          await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        }
        if (newly > 0) {
          toast.success(
            newly === 1
              ? "New reply saved — check Replied"
              : `${newly} new replies saved — check Replied`
          );
          setFilter("REPLIED");
        }
      } catch (err) {
        // Silent — rate limits / offline should not spam the UI.
        console.warn("Reply sync failed:", err?.message || err);
      }
    };

    runSync();
    const id = setInterval(runSync, 90_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [queryClient]);

  const sentEmails = useMemo(
    () =>
      messages
        .filter(
          (message) =>
            !pendingDeleteIds.has(message._id) && isTrackedOutreach(message)
        )
        .sort(
          (a, b) =>
            new Date(b.approvedAt || b.sentAt || 0) -
            new Date(a.approvedAt || a.sentAt || 0)
        ),
    [messages, pendingDeleteIds]
  );

  const stats = useMemo(() => {
    let replied = 0;
    let awaiting = 0;
    let ready = 0;

    for (const m of sentEmails) {
      const key = getSectionKey(m, now);
      if (key === "REPLIED") replied += 1;
      else if (key === "AWAITING") awaiting += 1;
      else if (key === "READY") ready += 1;
    }

    return { total: sentEmails.length, replied, awaiting, ready };
  }, [sentEmails, now]);

  const visibleEmails = useMemo(() => {
    if (filter === "ALL") return sentEmails;
    return sentEmails.filter((m) => getSectionKey(m, now) === filter);
  }, [sentEmails, filter, now]);

  const selectSection = (key) =>
    setFilter((prev) => (prev === key ? "ALL" : key));

  const FILTER_LABELS = {
    ALL: "Emails Sent",
    AWAITING: "Awaiting Reply",
    READY: "Follow-up Ready",
    REPLIED: "Replied",
  };

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["outreach"] });

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      const result = await syncOutreachReplies({ limit: 60 });
      await refresh();
      await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      const newly = Number(result?.replied || 0);
      const saved = Number(result?.saved || 0);
      if (newly > 0 || saved > 0) {
        toast.success(
          newly > 0
            ? `${newly} conversation(s) moved to Replied`
            : `${saved} reply update(s) saved`
        );
        if (newly > 0) setFilter("REPLIED");
      } else {
        toast.success("No new replies in Gmail yet");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to sync replies from Gmail"
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleReply = async (id) => {
    try {
      setReplyingId(id);
      const res = await markReplied(id);
      const updated = res?.data;
      if (updated?._id) {
        queryClient.setQueryData(["outreach"], (old = []) =>
          old.map((m) =>
            m._id === updated._id
              ? {
                  ...m,
                  ...updated,
                  replyReceived: true,
                  followUpStatus: "Replied",
                  sequenceCancelled: true,
                }
              : m
          )
        );
      } else {
        await refresh();
      }
      await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      const cancelled = res?.cancelled;
      toast.success(
        cancelled > 0
          ? `Marked as replied. ${cancelled} remaining sequence email(s) cancelled.`
          : "Marked as replied."
      );
      setFilter("REPLIED");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark as replied");
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
      <div className="text-red-500 text-xl">Failed to load outreach status</div>
    );
  }

  return (
    <div className="space-y-7">
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
          onClick={() => selectSection("AWAITING")}
        />
        <StatCard
          label="Follow-up Ready"
          value={stats.ready}
          icon={icons.bolt}
          gradient="from-orange-500 to-red-500"
          ring="hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.5)]"
          text="text-orange-300"
          active={filter === "READY"}
          onClick={() => selectSection("READY")}
        />
        <StatCard
          label="Replied"
          value={stats.replied}
          icon={icons.check}
          gradient="from-emerald-500 to-green-600"
          ring="hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)]"
          text="text-emerald-300"
          active={filter === "REPLIED"}
          onClick={() => selectSection("REPLIED")}
        />
      </div>

      {sentEmails.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#2A3550] bg-[#10182B] p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-4">
            <Icon path={icons.mail} className="w-7 h-7" />
          </div>
          <p className="text-gray-200 font-semibold text-lg">
            No emails sent yet
          </p>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            Approve &amp; send from Outreach Queue. When contacts reply, they
            appear under Replied with the saved Gmail message.
          </p>
        </div>
      )}

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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={syncing}
              className="text-sm text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50"
            >
              {syncing ? "Checking Gmail…" : "Check for replies"}
            </button>
            {filter !== "ALL" && (
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Clear filter ×
              </button>
            )}
          </div>
        </div>
      )}

      {sentEmails.length > 0 && (
        <div className="rounded-2xl border border-[#22304F] bg-[#10182B] overflow-hidden shadow-xl">
          {visibleEmails.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              {filter === "REPLIED"
                ? "No replies yet. When a contact responds, their message is saved and shown here."
                : `No emails in “${FILTER_LABELS[filter] || filter}”.`}
              {filter !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setFilter("ALL")}
                  className="block mx-auto mt-3 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Show all sent emails
                </button>
              )}
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
                    <th className="px-4 py-4 font-semibold">
                      {filter === "REPLIED" ? "Reply" : "Sent At"}
                    </th>
                    <th className="px-4 py-4 font-semibold">Follow-up</th>
                    <th className="px-4 py-4 font-semibold">Next Follow-up</th>
                    <th className="px-4 py-4 font-semibold text-center">Count</th>
                    <th className="px-4 py-4 font-semibold">Action</th>
                    <th className="px-4 py-4 font-semibold">Details</th>
                    <th className="px-4 py-4 font-semibold">Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleEmails.map((msg) => {
                    const fu = deriveFollowUp(msg, now);
                    const nextMs = msg.nextFollowUpTime
                      ? new Date(msg.nextFollowUpTime).getTime() - now
                      : 0;
                    const snippet = replySnippet(msg);

                    const overallStatus = isReplied(msg)
                      ? "Replied"
                      : msg.followUpStatus ||
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
                        <td className="px-4 py-4 text-gray-400 text-sm whitespace-nowrap">
                          {msg.outreachBatch ? `#${msg.outreachBatch}` : "—"}
                        </td>

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

                        <td className="px-4 py-4 text-gray-300">
                          {msg.company || "—"}
                        </td>

                        <td className="px-4 py-4 text-gray-400 text-sm max-w-[190px] truncate">
                          {msg.email || msg.deliveredTo || "—"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isReplied(msg)
                                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                                : msg.followUpCount > 0
                                  ? "bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30"
                                  : "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                            }`}
                          >
                            {overallStatus}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm max-w-[240px]">
                          {isReplied(msg) ? (
                            <div className="space-y-1">
                              <p className="text-emerald-300/90 text-xs font-medium truncate">
                                {msg.replySubject || "Inbound reply"}
                              </p>
                              <p className="text-gray-400 text-xs line-clamp-2 whitespace-pre-line">
                                {snippet ||
                                  (msg.replyReceivedAt
                                    ? `Received ${new Date(
                                        msg.replyReceivedAt
                                      ).toLocaleString()}`
                                    : "Reply recorded — open to view")}
                              </p>
                            </div>
                          ) : msg.status === "SCHEDULED" &&
                            msg.scheduledSendLabel ? (
                            <span className="text-gray-400">
                              {msg.scheduledSendLabel}
                            </span>
                          ) : (
                            <span className="text-gray-400 whitespace-nowrap">
                              {msg.sentAt
                                ? new Date(msg.sentAt).toLocaleString()
                                : msg.approvedAt
                                  ? new Date(msg.approvedAt).toLocaleString()
                                  : "—"}
                            </span>
                          )}
                        </td>

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
                              Sequence stopped
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

                        <td className="px-4 py-4 whitespace-nowrap">
                          {isReplied(msg) ||
                          fu.key === "SCHEDULED" ||
                          fu.key === "QUEUED" ? (
                            <span className="text-gray-500 text-sm">—</span>
                          ) : fu.ready ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-500/15 text-orange-300">
                              <Icon path={icons.bolt} className="w-3.5 h-3.5" />
                              Ready now
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#192540] text-gray-300">
                              <Icon path={icons.clock} className="w-3.5 h-3.5" />
                              {formatCountdown(nextMs)}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-[#192540] text-gray-200 font-semibold text-sm">
                            {msg.followUpCount || 0}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          {fu.key === "SCHEDULED" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30">
                              Queued
                            </span>
                          ) : fu.key === "QUEUED" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
                              Worker processing
                            </span>
                          ) : isReplied(msg) ? (
                            <button
                              type="button"
                              onClick={() => setReplyViewerMsg(msg)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25 transition"
                            >
                              <Icon path={icons.inbox} className="w-3.5 h-3.5" />
                              View reply
                            </button>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <button
                                type="button"
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
                                type="button"
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

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => setDetailsId(msg._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#192540] text-gray-200 ring-1 ring-[#2A3550] hover:ring-cyan-500/50 hover:text-white transition"
                            title="View full outreach timeline"
                          >
                            <Icon path={icons.clock} className="w-3.5 h-3.5" />
                            Details
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(msg)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-300 ring-1 ring-red-500/30 hover:bg-red-500/20 hover:ring-red-400/50 transition"
                            title="Permanently delete this outreach"
                          >
                            🗑 Delete
                          </button>
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

      <FollowUpComposer
        msg={composerMsg}
        onClose={() => setComposerMsg(null)}
        onSent={async () => {
          setComposerMsg(null);
          await refresh();
          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        }}
      />

      <ReplyViewer
        msg={replyViewerMsg}
        onClose={() => setReplyViewerMsg(null)}
      />

      <OutreachDetailsDrawer
        outreachId={detailsId}
        onClose={() => setDetailsId(null)}
      />

      <DeleteConfirmModal
        message={deleteCandidate}
        deleting={deleteMutation.isPending}
        onCancel={() => {
          if (!deleteMutation.isPending) setDeleteCandidate(null);
        }}
        onConfirm={() => {
          if (deleteCandidate?._id) stageDelete(deleteCandidate);
        }}
      />
    </div>
  );
}
