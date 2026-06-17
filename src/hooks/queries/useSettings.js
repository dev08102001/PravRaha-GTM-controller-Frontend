import { useEffect, useState } from "react";
import api from "../../services/api";
 
/*
 * TEMPORARY MOCK SETTINGS
 * ------------------------------------------------------------
 * Backend currently returns:
 * {
 *   success: true,
 *   data: null
 * }
 *
 * Until the Settings API is fully implemented,
 * use this mock data so the UI can be developed
 * and tested without backend dependency.
 *

 * Remove MOCK_SETTINGS once the backend starts
 * returning actual settings data.
 */
const MOCK_SETTINGS = {
  integrations: [
    {
      _id: 1,
      name: "Apollo.io",
      desc: "Contact enrichment layer 1",
      status: "CONNECTED",
    },
    {
      _id: 2,
      name: "Clay",
      desc: "Enrichment layer 2",
      status: "CONNECTED",
    },
    {
      _id: 3,
      name: "Drup",
      desc: "Buying intelligence",
      status: "CONNECTED",
    },
  ],
 
  preferences: [
    {
      _id: 1,
      label: "Auto approve messages",
      enabled: true,
    },
    {
      _id: 2,
      label: "Human review required",
      enabled: false,
    },
  ],
 
  teamMembers: [
    {
      _id: 1,
      name: "Pankaj Kumar",
      email: "pankaj@pravraha.com",
      role: "ADMIN",
    },
  ],
 
  emailInfrastructure: {
    sendGridConnected: "ACTIVE",
    domainWarming: "COMPLETE",
    dailySendLimit: "1500/day",
    healthScore: 95,
  },
};
 
export default function useSettings() {
  const [loading, setLoading] = useState(true);
 
  const [settings, setSettings] = useState({
    integrations: [],
    preferences: [],
    teamMembers: [],
    emailInfrastructure: {
      sendGridConnected: "",
      domainWarming: "",
      dailySendLimit: "",
      healthScore: 0,
    },
  });
 
  useEffect(() => {
    fetchSettings();
  }, []);
 
  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
 
      console.log("SETTINGS API RESPONSE:", response.data);
 
      if (response.data?.success) {
        /*
         * If backend returns actual settings,
         * use them.
         *
         * Otherwise use temporary mock data.
         */
        setSettings(response.data.data || MOCK_SETTINGS);
      }
    } catch (error) {
      console.error("Settings Fetch Error:", error);
 
      /*
       * Fallback to mock data if API fails.
       * Allows UI development to continue.
       */
      setSettings(MOCK_SETTINGS);
    } finally {
      setLoading(false);
    }
  };
 
  return {
    loading,
    settings,
    refetch: fetchSettings,
  };
}