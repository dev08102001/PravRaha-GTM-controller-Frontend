import { useEffect, useState } from "react";
import { getMailboxes } from "../../services/mailboxService";

const DEFAULT_MAILBOXES = [];

const normalizeMailboxes = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.mailboxes)) return payload.mailboxes;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.mailboxes)) return payload.data.mailboxes;
  return [];
};

export default function useMailboxes() {
  const [loading, setLoading] = useState(true);
  const [mailboxes, setMailboxes] = useState(DEFAULT_MAILBOXES);

  useEffect(() => {
    fetchMailboxes();
  }, []);

  const fetchMailboxes = async () => {
    try {
      setLoading(true);
      const response = await getMailboxes();

      if (response?.success) {
        setMailboxes(normalizeMailboxes(response));
      } else {
        setMailboxes(DEFAULT_MAILBOXES);
      }
    } catch (error) {
      console.error("Mailboxes Fetch Error:", error);
      setMailboxes(DEFAULT_MAILBOXES);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    mailboxes,
    refetch: fetchMailboxes,
  };
}
