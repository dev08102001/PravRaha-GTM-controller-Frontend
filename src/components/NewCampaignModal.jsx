// import React, { useState, useEffect, useRef } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "../services/api";

// interface CampaignPayload {
//   title: string;
//   goal: string;
//   channels: string[];
//   agents: string[];
//   createdAt: string;
// }

// // --- Inline Icons to replace lucide-react and prevent crashes ---
// const CheckIcon = ({ className }: { className?: string }) => (
//   <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12"></polyline>
//   </svg>
// );
// const MailIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//     <polyline points="22,6 12,13 2,6"></polyline>
//   </svg>
// );
// const LinkedinIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
//     <rect x="2" y="9" width="4" height="12"></rect>
//     <circle cx="4" cy="4" r="2"></circle>
//   </svg>
// );
// const PhoneIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//   </svg>
// );
// const MessageSquareIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
//   </svg>
// );

// // --- Reusable Chip Components ---

// interface ChannelChipProps {
//   label: string;
//   selected: boolean;
//   onClick: () => void;
//   icon: React.ReactNode;
// }

// const ChannelChip: React.FC<ChannelChipProps> = ({ label, selected, onClick, icon }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
//       selected
//         ? "bg-[#FF5A7A]/10 border-[#FF5A7A] text-white"
//         : "bg-[#1C2538] border-gray-700 text-gray-400 hover:bg-[#2A3550] hover:border-gray-600"
//     }`}
//   >
//     {icon}
//     <span>{label}</span>
//     {selected && <CheckIcon className="ml-auto text-[#FF5A7A]" />}
//   </button>
// );

// interface AgentChipProps {
//   label: string;
//   selected: boolean;
//   onClick: () => void;
// }

// const AgentChip: React.FC<AgentChipProps> = ({ label, selected, onClick }) => (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
//         selected
//           ? "bg-[#FF5A7A]/10 border-[#FF5A7A] text-white"
//           : "bg-[#1C2538] border-gray-700 text-gray-400 hover:bg-[#2A3550] hover:border-gray-600"
//       }`}
//     >
//       <span>{label}</span>
//       {selected && <CheckIcon className="ml-auto text-[#FF5A7A]" />}
//     </button>
// );

// // --- Main Modal Component ---

// export interface NewCampaignModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [campaignName, setCampaignName] = useState("");
//   const [goal, setGoal] = useState("");
//   const [channels, setChannels] = useState<string[]>(["Email", "LinkedIn"]);
//   const [agents, setAgents] = useState<string[]>([
//     "Market Scanner",
//     "Account Research",
//     "Buyer Discovery",
//     "Messaging",
//     "Campaign Exec",
//     "Pipeline Opt",
//   ]);

//   const modalRef = useRef<HTMLDivElement>(null);
//   const queryClient = useQueryClient();

//   // Setup React Query Mutation for automatic state handling & cache invalidation
//   const mutation = useMutation({
//     mutationFn: async (payload: CampaignPayload) => {
//       const { data } = await api.post("/campaigns", payload);
//       return data;
//     },
//     onSuccess: () => {
//       // Invalidate the campaigns query so the list auto-updates seamlessly
//       queryClient.invalidateQueries({ queryKey: ["campaigns"] });
//       alert("Campaign launched successfully");
//       onSuccess();
//     },
//     onError: (error: any) => {
//       console.error("Failed to launch campaign:", error);
//       alert(error?.message || "Failed to launch campaign. Please try again.");
//     }
//   });

//   // Close on ESC key press
//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => {
//       window.removeEventListener('keydown', handleEsc);
//     };
//   }, [onClose]);

//   // Reset form on close
//   useEffect(() => {
//     if (!isOpen) {
//         setCampaignName("");
//         setGoal("");
//         setChannels(["Email", "LinkedIn"]);
//         setAgents([
//             "Market Scanner",
//             "Account Research",
//             "Buyer Discovery",
//             "Messaging",
//             "Campaign Exec",
//             "Pipeline Opt",
//         ]);
//     }
//   }, [isOpen]);

//   const handleToggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
//     setter(prev => 
//       prev.includes(item) 
//         ? prev.filter(i => i !== item) 
//         : [...prev, item]
//     );
//   };

//   const handleLaunchCampaign = () => {
//     if (!campaignName.trim() || !goal.trim()) {
//       alert("Please fill in Campaign Name and Goal.");
//       return;
//     }

//     const payload: CampaignPayload = {
//       title: campaignName, // align with campaignMapper fetching `campaign.title`
//       goal: goal,
//       channels: channels,
//       agents: agents,
//       createdAt: new Date().toISOString(),
//     };
    
//     mutation.mutate(payload);
//   };

//   if (!isOpen) return null;

//   const ALL_CHANNELS = [
//     { name: "Email", icon: <MailIcon /> },
//     { name: "LinkedIn", icon: <LinkedinIcon /> },
//     { name: "Cold Call", icon: <PhoneIcon /> },
//     { name: "WhatsApp", icon: <MessageSquareIcon /> },
//   ];

//   const ALL_AGENTS = [
//     "Market Scanner",
//     "Account Research",
//     "Buyer Discovery",
//     "Messaging",
//     "Campaign Exec",
//     "Pipeline Opt",
//   ];

//   return (
//     <div 
//       className="fixed inset-0 bg-[#0B1220]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div 
//         ref={modalRef}
//         className="bg-[#151D2E] w-full max-w-[600px] rounded-2xl border border-white/10 shadow-2xl flex flex-col"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-white/10">
//           <h2 className="text-2xl font-bold text-white">New Campaign</h2>
//           <p className="text-gray-400 mt-1">Configure your campaign goal and let agents do the rest</p>
//         </div>

//         {/* Body - For robust focus trapping, consider a library like 'focus-trap-react' */}
//         <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
//           {/* Campaign Name */}
//           <div>
//             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Campaign Name</label>
//             <input
//               type="text"
//               value={campaignName}
//               onChange={(e) => setCampaignName(e.target.value)}
//               placeholder="e.g. Q1 DevTools Outreach"
//               className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A7A]"
//             />
//           </div>

//           {/* Goal */}
//           <div>
//             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Goal (Natural Language)</label>
//             <textarea
//               value={goal}
//               onChange={(e) => setGoal(e.target.value)}
//               placeholder="e.g. Book 20 meetings with VP Engineering at Series A DevTools companies in the US this month"
//               rows={4}
//               className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A7A] resize-none"
//             />
//           </div>

//           {/* Channels */}
//           <div>
//             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Channels</label>
//             <div className="flex flex-wrap gap-3">
//               {ALL_CHANNELS.map(channel => (
//                 <ChannelChip
//                   key={channel.name}
//                   label={channel.name}
//                   icon={channel.icon}
//                   selected={channels.includes(channel.name)}
//                   onClick={() => handleToggle(setChannels, channel.name)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Agents */}
//           <div>
//             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Agents to Deploy</label>
//             <div className="flex flex-wrap gap-3">
//               {ALL_AGENTS.map(agent => (
//                 <AgentChip
//                   key={agent}
//                   label={agent}
//                   selected={agents.includes(agent)}
//                   onClick={() => handleToggle(setAgents, agent)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#151D2E] rounded-b-2xl">
//           <button 
//             onClick={onClose}
//             className="px-6 py-2 rounded-lg bg-[#24304A] hover:bg-[#30405F] text-white font-semibold transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleLaunchCampaign}
//             // Note: If using React Query v4, you may need to use `isLoading` instead of `isPending`
//             disabled={mutation.isPending}
//             className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF5A7A] to-red-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#FF5A7A]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {mutation.isPending ? "Launching..." : "🚀 Launch Campaign"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewCampaignModal;




import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { getCustomers } from "../services/customerService";
import { normalizeRole } from "../utils/roleUtils";

// --- Inline Icons ---
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LinkedinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MessageSquareIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

// --- Reusable Components ---

const ChannelChip = ({ label, selected, onClick, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
      selected
        ? "bg-[#FF5A7A]/10 border-[#FF5A7A] text-white"
        : "bg-[#1C2538] border-gray-700 text-gray-400 hover:bg-[#2A3550] hover:border-gray-600"
    }`}
  >
    {icon}
    <span>{label}</span>
    {selected && <CheckIcon className="ml-auto text-[#FF5A7A]" />}
  </button>
);

const AgentChip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
      selected
        ? "bg-[#FF5A7A]/10 border-[#FF5A7A] text-white"
        : "bg-[#1C2538] border-gray-700 text-gray-400 hover:bg-[#2A3550] hover:border-gray-600"
    }`}
  >
    <span>{label}</span>
    {selected && <CheckIcon className="ml-auto text-[#FF5A7A]" />}
  </button>
);

  const NewCampaignModal = ({
    isOpen,
    onClose,
    onSuccess,
    campaign,
  }) => {

  const [campaignName, setCampaignName] = useState("");
  const [goal, setGoal] = useState("");
  const [customers, setCustomers] =
    useState([]);
  const [users, setUsers] =
    useState([]);

  const [assignedUsers, setAssignedUsers] =
    useState([]);

  const [customerId, setCustomerId] =
   useState("");
    let currentUser = {};

try {
  currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
} catch {
  currentUser = {};
}

  const currentRole = normalizeRole(currentUser.role);
  const [channels, setChannels] = useState(["Email", "LinkedIn"]);

  const [agents, setAgents] = useState([
    "Market Scanner",
    "Account Research",
    "Buyer Discovery",
    "Messaging",
    "Campaign Exec",
    "Pipeline Opt",
  ]);

  const modalRef = useRef(null);

  const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: async (payload) => {
    if (campaign) {
      
      const { data } = await api.put(
        `/campaigns/${campaign._id}`,
        payload
      );
      return data;
    }

    const { data } = await api.post(
      "/campaigns",
      payload
    );

    return data;
  },

  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["campaigns"],
    });

    alert(
      campaign
        ? "Campaign updated successfully"
        : "Campaign launched successfully"
    );

    onSuccess();
  },

  onError: (error) => {
    console.error(error);

    alert(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to launch campaign"
    );
  },
});

  // Close on ESC key press
  // Load Customers
useEffect(() => {
  const loadCustomers = async () => {
  try {
    const usersResponse =
      await api.get("/users");

    if (
      usersResponse?.data?.success
    ) {
      setUsers(
        usersResponse.data.data || []
      );
    }

    if (currentRole === "admin") {
      const response =
        await getCustomers();

      if (response?.success) {
        setCustomers(
          response.data || []
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

  if (
  currentRole === "admin" ||
  currentRole === "manager"
) {
  loadCustomers();
}
}, [currentRole]);

// Close Modal on ESC
useEffect(() => {
  const handleEsc = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener(
    "keydown",
    handleEsc
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleEsc
    );
  };
}, [onClose]);
  // Reset form on close
  useEffect(() => {
    if (campaign) {
  setCampaignName(campaign.title || "");
  setGoal(campaign.goal || "");
  setAssignedUsers(
  campaign.assignedUsers?.map(
    (user) => user._id || user
  ) || []
);

  setCustomerId(
    campaign.customerId?._id ||
    campaign.customerId ||
    ""
  );

  setChannels(
    campaign.channels || [
      "Email",
      "LinkedIn",
    ]
  );

  setAgents(
    campaign.agents || [
      "Market Scanner",
      "Account Research",
      "Buyer Discovery",
      "Messaging",
      "Campaign Exec",
      "Pipeline Opt",
    ]
  );
  } else if (isOpen) {
    setAssignedUsers([]);
    setCustomerId("");
    setCampaignName("");
    setGoal("");
    setChannels(["Email", "LinkedIn"]);
    setAgents([
      "Market Scanner",
      "Account Research",
      "Buyer Discovery",
      "Messaging",
      "Campaign Exec",
      "Pipeline Opt",
    ]);
  }
}, [campaign, isOpen]);

  const handleToggle = (setter, item) => {
    setter((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

const handleLaunchCampaign = () => {
  if (!campaignName.trim() || !goal.trim()) {
    alert("Please fill in Campaign Name and Goal");
    return;
  }

  if (currentRole === "admin" && !customerId) {
    alert("Select Customer");
    return;
  }

  const payload = {
    title: campaignName.trim(),
    name: campaignName.trim(),
    goal: goal.trim(),
    channels,
    agents,
    assignedUsers,
    status: campaign?.status || "running",
  };

  // Super admin can create without a customer (common for this DB).
  // Admin/manager must attach their customer.
  if (currentRole === "admin") {
    payload.customerId = customerId;
  } else if (currentRole === "super_admin" && customerId) {
    payload.customerId = customerId;
  }

  mutation.mutate(payload);
};

  if (!isOpen) return null;

  const ALL_CHANNELS = [
    { name: "Email", icon: <MailIcon /> },
    { name: "LinkedIn", icon: <LinkedinIcon /> },
    { name: "Cold Call", icon: <PhoneIcon /> },
    { name: "WhatsApp", icon: <MessageSquareIcon /> },
  ];

  const ALL_AGENTS = [
    "Market Scanner",
    "Account Research",
    "Buyer Discovery",
    "Messaging",
    "Campaign Exec",
    "Pipeline Opt",
  ];

  return (
    <div
      className="fixed inset-0 bg-[#0B1220]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-[#151D2E] w-full max-w-[600px] rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {campaign ? "Edit Campaign" : "New Campaign"}
        </h2>
          <p className="text-gray-400 mt-1">Configure your campaign goal and let agents do the rest</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Campaign Name */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Q1 DevTools Outreach"
              className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A7A]"
            />
          </div>
        {currentRole === "admin" && (
  <div>
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
      Customer
    </label>

    <select
      value={customerId}
      onChange={(e) =>
        setCustomerId(e.target.value)
      }
      className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-3 text-white"
    >
      <option value="">
        Select Customer
      </option>

      {customers.map((customer) => (
        <option
          key={customer._id}
          value={customer._id}
        >
          {customer.companyName}
        </option>
      ))}
    </select>
  </div>
)}
          {/* Goal */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Goal (Natural Language)</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Book 20 meetings with VP Engineering at Series A DevTools companies in the US this month"
              rows={4}
              className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A7A] resize-none"
            />
          </div>

          {/* Channels */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Channels</label>
            <div className="flex flex-wrap gap-3">
              {ALL_CHANNELS.map((channel) => (
                <ChannelChip
                  key={channel.name}
                  label={channel.name}
                  icon={channel.icon}
                  selected={channels.includes(channel.name)}
                  onClick={() => handleToggle(setChannels, channel.name)}
                />
              ))}
            </div>
          </div>

          {/* Agents */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Agents to Deploy</label>
            <div className="flex flex-wrap gap-3">
              {ALL_AGENTS.map((agent) => (
                <AgentChip
                  key={agent}
                  label={agent}
                  selected={agents.includes(agent)}
                  onClick={() => handleToggle(setAgents, agent)}
                />
              ))}
            </div>
          </div>
        {/* Assigned Users */}
<div>
  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
    Assign Users
  </label>

  <div className="grid grid-cols-2 gap-3">
    {users
      .filter(
        (user) =>
          user.role?.toLowerCase() ===
          "user"
      )
      .map((user) => (
        <label
          key={user._id}
          className="flex items-center gap-2 text-white"
        >
          <input
            type="checkbox"
            checked={assignedUsers.includes(
              user._id
            )}
            onChange={(e) => {
              if (e.target.checked) {
                setAssignedUsers([
                  ...assignedUsers,
                  user._id,
                ]);
              } else {
                setAssignedUsers(
                  assignedUsers.filter(
                    (id) =>
                      id !== user._id
                  )
                );
              }
            }}
          />

          {user.firstName}{" "}
          {user.lastName}
        </label>
      ))}
  </div>
</div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#151D2E] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#24304A] hover:bg-[#30405F] text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLaunchCampaign}
            disabled={mutation.isPending || mutation.isLoading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF5A7A] to-red-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#FF5A7A]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {mutation.isPending || mutation.isLoading
              ? campaign
                ? "Updating..."
                : "Launching..."
            : campaign
            ? "💾 Update Campaign"
            : "🚀 Launch Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCampaignModal;
