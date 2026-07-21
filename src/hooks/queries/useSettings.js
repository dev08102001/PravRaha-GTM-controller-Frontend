import { useEffect, useState } from "react";
import { getSettings } from "../../services/settingsService";

const DEFAULT_SETTINGS = {
  integrations: [],
  preferences: [],
  teamMembers: [],
  emailInfrastructure: {
    sendGridConnected: "",
    domainWarming: "",
    dailySendLimit: "",
    healthScore: 0,
  },
  selectedMailboxId: null,
};

export default function useSettings() {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response =
        await getSettings();

      if (
        response?.success &&
        response?.data
      ) {
        setSettings({
          integrations:
            response.data.integrations || [],
          preferences:
            response.data.preferences || [],
          teamMembers:
            response.data.teamMembers || [],
          emailInfrastructure:
            response.data
              .emailInfrastructure || {
              sendGridConnected: "",
              domainWarming: "",
              dailySendLimit: "",
              healthScore: 0,
            },
          selectedMailboxId:
            response.data.selectedMailboxId || null,
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error(
        "Settings Fetch Error:",
        error
      );

      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    settings,
    setSettings,
    refetch: fetchSettings,
  };
}