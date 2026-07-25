import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useOutreach from "../hooks/queries/useOutreach";
import SendSuccessModal from "../components/outreach/SendSuccessModal";
import ConfirmSendModal from "../components/outreach/ConfirmSendModal";
import ContactLocalTime from "../components/outreach/ContactLocalTime";
import TiptapEditor from "./TiptapEditor";

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

const MAX_FOLLOW_UPS = 6;
const QUEUE_PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];
const FOLLOW_UP_INTERVAL_OPTIONS = [
  { hours: 0.5, label: "30 Min" },
  { hours: 24, label: "24 Hours" },
  { hours: 48, label: "48 Hours" },
  { hours: 72, label: "72 Hours" },
  { hours: 96, label: "96 Hours" },
  { hours: 120, label: "120 Hours" },
  { hours: 144, label: "144 Hours" },
  { hours: 168, label: "168 Hours (7 Days)" },
];

const clampMaxFollowUps = (value, fallback = MAX_FOLLOW_UPS) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_FOLLOW_UPS, Math.max(0, Math.round(n)));
};

const normalizeFollowUpIntervalHours = (value) => {
  const hours = Number(value);
  return FOLLOW_UP_INTERVAL_OPTIONS.some((option) => option.hours === hours)
    ? hours
    : 24;
};

const firstNameOf = (name = "") =>
  String(name || "")
    .trim()
    .split(/\s+/)[0] || "there";

const withRePrefix = (subject) => {
  const s = String(subject || "").trim() || "Following up";
  return s.toLowerCase().startsWith("re:") ? s : `Re: ${s}`;
};

const nicheOf = (msg = {}) => {
  const raw = String(
    msg.niche || msg.industry || msg.campaignGoal || msg.goal || ""
  )
    .replace(/\s+/g, " ")
    .trim();
  if (raw) {
    const cut = raw.slice(0, 48);
    const lastSpace = cut.lastIndexOf(" ");
    const short =
      raw.length > 48 && lastSpace > 18 ? cut.slice(0, lastSpace) : cut;
    return short.replace(/[.,;:]+$/g, "").toLowerCase();
  }
  const ctx = String(msg.context || "")
    .replace(/\s+/g, " ")
    .trim();
  if (ctx) {
    return (
      ctx.split(" ").slice(0, 4).join(" ").replace(/[.,;:]+$/g, "").toLowerCase() ||
      "B2B sales"
    );
  }
  return "B2B sales";
};

const resolveFollowUpTemplateIndex = (followUpIndex, totalFollowUps = 5) => {
  const total = Math.max(1, Number(totalFollowUps) || 1);
  const idx = Math.max(0, Number(followUpIndex) || 0);
  if (idx >= total - 1) return 4;
  if (total === 1) return 4;
  if (total === 2) return 0;
  if (total === 3) return idx === 0 ? 0 : 1;
  if (total === 4) return [0, 1, 2][idx] ?? 2;
  if (total === 5) return Math.min(idx, 3);
  return Math.min(idx, 3);
};

const buildLocalFollowUpSubject = (msg, followUpIndex, totalFollowUps = 5) => {
  // Keep every follow-up on Re: + initial so the full campaign
  // (initial + FU1…FU6) stays one conversation in Gmail/Outlook.
  void followUpIndex;
  void totalFollowUps;
  const fromInitial =
    msg.initialSubject ||
    (Array.isArray(msg.emailSequence)
      ? msg.emailSequence.find((s) => Number(s?.step) === 0)?.subject
      : "") ||
    "";
  const base =
    String(fromInitial || msg.subject || "")
      .replace(/^re:\s*/i, "")
      .trim() || `5 Qualified leads for ${nicheOf(msg)}`;
  return withRePrefix(base);
};

/** Founder follow-up arc — last of N always uses the break-up mail. */
const buildLocalFollowUpBody = (msg, followUpIndex, totalFollowUps = 5) => {
  const firstName = firstNameOf(msg.name);
  const templateIndex = resolveFollowUpTemplateIndex(
    followUpIndex,
    totalFollowUps
  );

  switch (templateIndex) {
    case 0:
      return `${firstName},

Any thoughts?

What's your no-show rate on booked meetings, and what's your average cost per qualified meeting?

I've lived in those numbers for a while — happy to compare notes if useful.

Thanks,
`;
    case 1:
      return `Hello ${firstName},

Hiring SDRs is expensive. Training them takes time. Managing them takes even more.

The folks I work with have carried quota themselves — some for a long time — and they bring their own tools, so that's not another line item on your side.

Would you be open to a brief conversation?
`;
    case 2:
      return `${firstName},

One thing most agencies won't admit: the founder sells you, then disappears.

Not how I work. I stay on the account. Happy to walk you through how we keep qualified conversations moving without the usual bait-and-switch.
`;
    case 3:
      return `${firstName},

I'm not going to keep showing up in your inbox if this isn't a fit. One word does it — yes, later, or no. Any of those is fine by me and saves us both time.

Which is it?
`;
    case 4:
    default:
      return `${firstName},

I'll stop here. Assuming this isn't a priority right now.

If things change and you want a more predictable way to get qualified meetings on the calendar without hiring more SDRs, happy to reconnect.

Take care,
`;
  }
};

/** Normalize / backfill sequence for UI using the contact's chosen follow-up count. */
const getEmailSequence = (msg) => {
  const maxFollowUps = clampMaxFollowUps(msg.maxFollowUps, MAX_FOLLOW_UPS);
  const targetLength = 1 + maxFollowUps;
  const threadedSubject = buildLocalFollowUpSubject(msg, 0, maxFollowUps);

  const withThreadedSubjects = (steps = []) =>
    steps.map((step) =>
      Number(step?.step) === 0
        ? step
        : { ...step, subject: threadedSubject }
    );

  if (
    Array.isArray(msg.emailSequence) &&
    msg.emailSequence.length === targetLength
  ) {
    return withThreadedSubjects(msg.emailSequence);
  }

  if (Array.isArray(msg.emailSequence) && msg.emailSequence.length > 0) {
    // Fill missing steps with position-aware copy when count was just changed locally.
    const sliced = msg.emailSequence.slice(0, targetLength);
    while (sliced.length < targetLength) {
      const step = sliced.length;
      sliced.push({
        step,
        label: SEQUENCE_LABELS[step] || `Step ${step}`,
        subject: threadedSubject,
        body: buildLocalFollowUpBody(msg, step - 1, maxFollowUps),
        status:
          msg.replyReceived || msg.sequenceCancelled ? "CANCELLED" : "PENDING",
      });
    }
    return withThreadedSubjects(sliced);
  }

  const initialSubject = msg.subject || "Hello";
  const initialBody = msg.body || "";
  return SEQUENCE_LABELS.slice(0, targetLength).map((label, step) => {
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
      subject: threadedSubject,
      body: buildLocalFollowUpBody(msg, step - 1, maxFollowUps),
      status: msg.replyReceived || msg.sequenceCancelled ? "CANCELLED" : "PENDING",
    };
  });
};

const stripHtmlPreview = (htmlOrText = "") => {
  const raw = String(htmlOrText || "");
  if (!/<\/?[a-z][\s\S]*>/i.test(raw)) return raw;
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
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
  const [queuePage, setQueuePage] = useState(1);
  const [queuePageSize, setQueuePageSize] = useState(10);

  const getSelectedStep = (msgId) => selectedStepById[msgId] ?? 0;

  // Optimistic follow-up count update: the cache is patched instantly and the
  // PUT runs in the background — no full ["outreach"] refetch (that GET is
  // expensive on the backend and was the visible delay).
  const followUpsMutation = useMutation({
    mutationKey: ["outreach-max-follow-ups"],
    mutationFn: ({ id, maxFollowUps }) =>
      updateOutreachMessage(id, { maxFollowUps }),
    onMutate: async ({ id, maxFollowUps }) => {
      await queryClient.cancelQueries({ queryKey: ["outreach"] });
      const previous = queryClient.getQueryData(["outreach"]);

      queryClient.setQueryData(["outreach"], (old = []) =>
        old.map((m) => (m._id === id ? { ...m, maxFollowUps } : m))
      );

      // Keep selected step inside the new sequence range.
      if (getSelectedStep(id) > maxFollowUps) {
        setSelectedStepById((prev) => ({ ...prev, [id]: 0 }));
      }

      return { previous };
    },
    onError: (error, { id }, context) => {
      console.error(error);
      // Revert only the affected record so unrelated cache updates survive.
      const prevMsg = (context?.previous || []).find((m) => m._id === id);
      if (prevMsg) {
        queryClient.setQueryData(["outreach"], (old = []) =>
          old.map((m) =>
            m._id === id ? { ...m, maxFollowUps: prevMsg.maxFollowUps } : m
          )
        );
      }
      toast.error(
        error?.response?.data?.message || "Failed to update follow-up count"
      );
    },
    onSuccess: (res, { id, maxFollowUps }) => {
      const updated = res?.data;
      if (!updated) return;
      queryClient.setQueryData(["outreach"], (old = []) =>
        old.map((m) => {
          if (m._id !== id) return m;
          // Skip stale responses when the user has already clicked again.
          if (clampMaxFollowUps(m.maxFollowUps) !== clampMaxFollowUps(maxFollowUps)) {
            return m;
          }
          return { ...m, ...updated };
        })
      );
    },
    onSettled: () => {
      // Intentionally no invalidateQueries here: the server's authoritative
      // record is merged in onSuccess, and the periodic refetchInterval in
      // useOutreach reconciles anything else.
    },
  });

  const changeMaxFollowUps = (msg, nextValue) => {
    const maxFollowUps = clampMaxFollowUps(nextValue);
    if (maxFollowUps === clampMaxFollowUps(msg.maxFollowUps)) return;
    followUpsMutation.mutate({ id: msg._id, maxFollowUps });
  };

  const followUpIntervalMutation = useMutation({
    mutationKey: ["outreach-follow-up-interval"],
    mutationFn: ({ id, followUpIntervalHours }) =>
      updateOutreachMessage(id, { followUpIntervalHours }),
    onMutate: async ({ id, followUpIntervalHours }) => {
      await queryClient.cancelQueries({ queryKey: ["outreach"] });
      const previousMessage = (queryClient.getQueryData(["outreach"]) || []).find(
        (message) => message._id === id
      );

      queryClient.setQueryData(["outreach"], (old = []) =>
        old.map((message) =>
          message._id === id
            ? { ...message, followUpIntervalHours }
            : message
        )
      );

      return {
        previousInterval: normalizeFollowUpIntervalHours(
          previousMessage?.followUpIntervalHours
        ),
      };
    },
    onError: (error, { id, followUpIntervalHours }, context) => {
      console.error(error);
      queryClient.setQueryData(["outreach"], (old = []) =>
        old.map((message) => {
          if (message._id !== id) return message;
          // Do not overwrite a newer selection if an older request fails.
          if (
            normalizeFollowUpIntervalHours(message.followUpIntervalHours) !==
            followUpIntervalHours
          ) {
            return message;
          }
          return {
            ...message,
            followUpIntervalHours: context?.previousInterval ?? 24,
          };
        })
      );
      toast.error(
        error?.response?.data?.message || "Failed to update follow-up interval"
      );
    },
    onSuccess: (res, { id, followUpIntervalHours }) => {
      const updated = res?.data;
      if (!updated) return;
      queryClient.setQueryData(["outreach"], (old = []) =>
        old.map((message) => {
          if (message._id !== id) return message;
          // Ignore an older response when another selection is already visible.
          if (
            normalizeFollowUpIntervalHours(message.followUpIntervalHours) !==
            followUpIntervalHours
          ) {
            return message;
          }
          return { ...message, ...updated };
        })
      );
    },
    onSettled: () => {
      // The updated record is already in cache; avoid refetching the full queue.
    },
  });

  const changeFollowUpInterval = (msg, nextValue) => {
    const followUpIntervalHours = normalizeFollowUpIntervalHours(nextValue);
    if (
      followUpIntervalHours ===
      normalizeFollowUpIntervalHours(msg.followUpIntervalHours)
    ) {
      return;
    }
    followUpIntervalMutation.mutate({
      id: msg._id,
      followUpIntervalHours,
    });
  };

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
        toast.success(
          (res?.message || "Message scheduled.") +
            " Saved in Outreach Status."
        );
        return;
      }
      if (res?.queued) {
        toast.success(
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
        toast.error("This message is no longer available. The queue has been refreshed.");
      } else {
        toast.error(error?.response?.data?.message || "Failed to send message");
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
      toast.error("Failed to reject message");
    }
  };

  const sendAllMessages = async () => {
    toast.success(
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
        toast.error("Please enter a valid recipient email address.");
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
      toast.error(error?.response?.data?.message || "Failed to save message");
    } finally {
      setSaving(false);
    }
  };

  const openConfirmSend = (msg) => {
    const { stepIndex, step } = getActiveStepContent(msg);
    if (step?.status === "CANCELLED") {
      toast.error("This email step was cancelled and cannot be sent.");
      return;
    }
    if (step?.status === "SENT") {
      toast.error("This email step was already sent.");
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

  // Queue pagination — clamp instead of syncing state so removals
  // (send/reject) can never leave us on an empty page.
  const totalQueuePages = Math.max(
    1,
    Math.ceil(queueMessages.length / queuePageSize)
  );
  const currentQueuePage = Math.min(queuePage, totalQueuePages);
  const queueRangeStart = (currentQueuePage - 1) * queuePageSize;
  const pagedQueueMessages = queueMessages.slice(
    queueRangeStart,
    queueRangeStart + queuePageSize
  );

  const goToQueuePage = (page) => {
    const next = Math.max(1, Math.min(page, totalQueuePages));
    setQueuePage(next);
    // Bring the top of the queue back into view when switching pages.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeQueuePageSize = (size) => {
    setQueuePageSize(size);
    setQueuePage(1);
  };

  const QueuePager = () =>
    queueMessages.length === 0 ? null : (
      <div className="flex items-center justify-end gap-4 text-sm text-gray-300">
        <select
          value={queuePageSize}
          onChange={(e) => changeQueuePageSize(Number(e.target.value))}
          className="rounded-lg border border-[#2A3550] bg-[#151D2E] px-2.5 py-1.5 text-sm text-gray-200 outline-none hover:border-cyan-500/50 transition"
          title="Messages per page"
        >
          {QUEUE_PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <span className="tabular-nums whitespace-nowrap">
          {queueRangeStart + 1} –{" "}
          {Math.min(queueRangeStart + queuePageSize, queueMessages.length)} of{" "}
          {queueMessages.length}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToQueuePage(currentQueuePage - 1)}
            disabled={currentQueuePage === 1}
            aria-label="Previous page"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-[#1C2740] hover:text-white disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-gray-300 transition"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goToQueuePage(currentQueuePage + 1)}
            disabled={currentQueuePage === totalQueuePages}
            aria-label="Next page"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-[#1C2740] hover:text-white disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-gray-300 transition"
          >
            ›
          </button>
        </div>
      </div>
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
            {sendingAll ? "Running..." : "Approve and send all"}
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

      {/* Queue pagination (top) */}
      <QueuePager />

      {/* Queue — messages not yet sent */}
      {pagedQueueMessages.map((msg) => {
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

            {/* Sequence plan — choose length first so the mail arc matches */}
            <div className="mb-4 rounded-xl border border-[#2A3550] bg-[#0E1422]/20 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Follow-ups to send
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Whole thread wraps in{" "}
                    <span className="text-gray-300">
                      {1 + clampMaxFollowUps(msg.maxFollowUps)} email
                      {1 + clampMaxFollowUps(msg.maxFollowUps) === 1 ? "" : "s"}
                    </span>{" "}
                    (initial + {clampMaxFollowUps(msg.maxFollowUps)} follow-up
                    {clampMaxFollowUps(msg.maxFollowUps) === 1 ? "" : "s"}). Last
                    follow-up closes the loop.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      clampMaxFollowUps(msg.maxFollowUps) <= 0 ||
                      msg.replyReceived ||
                      msg.sequenceCancelled
                    }
                    onClick={() =>
                      changeMaxFollowUps(
                        msg,
                        clampMaxFollowUps(msg.maxFollowUps) - 1
                      )
                    }
                    className="w-8 h-8 rounded-lg border border-[#2A3550] text-gray-200 hover:border-cyan-500/50 hover:text-white disabled:opacity-40"
                    title="Fewer follow-ups"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-lg font-semibold text-cyan-300">
                    {clampMaxFollowUps(msg.maxFollowUps)}
                  </span>
                  <button
                    type="button"
                    disabled={
                      clampMaxFollowUps(msg.maxFollowUps) >= MAX_FOLLOW_UPS ||
                      msg.replyReceived ||
                      msg.sequenceCancelled
                    }
                    onClick={() =>
                      changeMaxFollowUps(
                        msg,
                        clampMaxFollowUps(msg.maxFollowUps) + 1
                      )
                    }
                    className="w-8 h-8 rounded-lg border border-[#2A3550] text-gray-200 hover:border-cyan-500/50 hover:text-white disabled:opacity-40"
                    title="More follow-ups"
                  >
                    +
                  </button>
                  <select
                    value={clampMaxFollowUps(msg.maxFollowUps)}
                    disabled={msg.replyReceived || msg.sequenceCancelled}
                    onChange={(e) =>
                      changeMaxFollowUps(msg, Number(e.target.value))
                    }
                    className="ml-1 rounded-lg border border-[#2A3550] bg-[#0E1422] px-2 py-1.5 text-xs text-gray-200 disabled:opacity-40"
                    title="Choose follow-up count"
                  >
                    {Array.from({ length: MAX_FOLLOW_UPS + 1 }, (_, n) => (
                      <option key={n} value={n}>
                        {n === 0
                          ? "0 follow-ups (initial only)"
                          : `${n} follow-up${n === 1 ? "" : "s"}`}
                      </option>
                    ))}
                  </select>

                  <div className="ml-2 flex items-center gap-2 border-l border-[#2A3550] pl-3">
                    <label
                      htmlFor={`follow-up-interval-${msg._id}`}
                      className="text-xs text-gray-400 whitespace-nowrap"
                    >
                      Follow-up Interval
                    </label>
                    <select
                      id={`follow-up-interval-${msg._id}`}
                      value={normalizeFollowUpIntervalHours(
                        msg.followUpIntervalHours
                      )}
                      disabled={msg.replyReceived || msg.sequenceCancelled}
                      onChange={(e) =>
                        changeFollowUpInterval(msg, Number(e.target.value))
                      }
                      className="rounded-lg border border-[#2A3550] bg-[#0E1422] px-2 py-1.5 text-xs text-cyan-200 disabled:opacity-40"
                      title="Choose the delay between every follow-up email"
                    >
                      {FOLLOW_UP_INTERVAL_OPTIONS.map(({ hours, label }) => (
                        <option key={hours} value={hours}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
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
            </div>

            {/* Compose surface — reads like a real mail draft */}
            <div className="rounded-xl border border-[#2A3550] overflow-hidden bg-[#0B101C]">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-[#2A3550] bg-[#121A2B]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 shrink-0">
                    Draft
                  </span>
                  <span className="text-sm text-gray-200 truncate">
                    {step?.label || SEQUENCE_LABELS[stepIndex]}
                  </span>
                </div>
                <span className="text-[11px] text-cyan-300/90 tabular-nums">
                  Email {stepIndex + 1} of {sequence.length}
                  {stepIndex > 0
                    ? ` · Follow-up ${stepIndex} of ${clampMaxFollowUps(msg.maxFollowUps)}`
                    : " · First touch"}
                  {stepIndex > 0 &&
                  stepIndex === sequence.length - 1 &&
                  clampMaxFollowUps(msg.maxFollowUps) > 0
                    ? " · Closes thread"
                    : ""}
                </span>
              </div>

              <div className="divide-y divide-[#2A3550]">
                <div className="grid grid-cols-[4.5rem_1fr] gap-2 px-4 py-2.5 text-sm items-center">
                  <span className="text-gray-500">To</span>
                  {editingId === msg._id ? (
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-transparent text-cyan-200 outline-none placeholder:text-gray-600"
                    />
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="text-cyan-300 truncate">
                        {msg.email || "No email on file — edit before sending"}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(msg)}
                        className="text-[11px] text-gray-500 hover:text-white underline shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-[4.5rem_1fr] gap-2 px-4 py-2.5 text-sm items-center">
                  <span className="text-gray-500">Subject</span>
                  {editingId === msg._id ? (
                    <input
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      disabled={stepCancelled || stepSent}
                      className="w-full bg-transparent font-medium text-white outline-none disabled:opacity-60"
                    />
                  ) : (
                    <div className="font-medium text-gray-100">{displaySubject}</div>
                  )}
                </div>
              </div>

              <div className="px-1 pb-1">
                {editingId === msg._id ? (
                  <div className="rounded-b-xl overflow-hidden bg-[#121A2B] border-t border-[#2A3550]">
                    <TiptapEditor value={editBody} onChange={setEditBody} />
                  </div>
                ) : (
                  <div className="px-4 py-5 whitespace-pre-line leading-7 text-[15px] text-gray-200 font-[system-ui,Segoe_UI,Helvetica,Arial,sans-serif] min-h-[9rem]">
                    {stripHtmlPreview(displayBody)}
                  </div>
                )}
              </div>

              {editingId === msg._id && (
                <p className="px-4 pb-3 text-[11px] text-amber-400/90">
                  Tip: keep it short and conversational — swap the To address to
                  a test inbox before Approve & Send.
                </p>
              )}
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

      {/* Queue pagination (bottom) */}
      <QueuePager />

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
                          ? ` • ${msg.emailSequence.filter((s) => s.status === "SENT").length}/${msg.emailSequence.length} sent`
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
