// import React from "react";
 
// export default function Settings() {
//   const integrations = [
//     {
//       name: "Apollo.io",
//       desc: "Contact enrichment layer 1",
//       status: "CONNECTED",
//     },
//     {
//       name: "Clay",
//       desc: "Enrichment layer 2 + waterfall",
//       status: "CONNECTED",
//     },
//     {
//       name: "Draup",
//       desc: "100-source buying intelligence",
//       status: "CONNECTED",
//     },
//     {
//       name: "Findymail",
//       desc: "Email verification",
//       status: "CONNECTED",
//     },
//     {
//       name: "LinkedIn Sales Nav",
//       desc: "LinkedIn outreach channel",
//       status: "CONNECTED",
//     },
//     {
//       name: "SendGrid",
//       desc: "Email delivery infrastructure",
//       status: "CONNECTED",
//     },
//     {
//       name: "Anthropic Claude",
//       desc: "Messaging generation (LLM)",
//       status: "CONNECTED",
//     },
//     {
//       name: "Salesforce CRM",
//       desc: "CRM sync (not configured)",
//       status: "DISCONNECTED",
//     },
//     {
//       name: "HubSpot",
//       desc: "CRM alternative (not configured)",
//       status: "DISCONNECTED",
//     },
//   ];
 
//   const preferences = [
//     "Auto-approve messages (score ≥ 90)",
//     "Require human review for LinkedIn messages",
//     "OPE send in business hours only (9am–6pm buyer TZ)",
//     "Pause campaign if reply rate drops below 4%",
//     "Real-time notifications for meetings booked",
//     "A/B testing on all message variants",
//   ];
 
//   return (
//     <div className="space-y-6">
//       {/* Header */}
 
//       <div>
//         <h1 className="text-4xl font-bold text-white">
//           Settings & Integrations
//         </h1>
 
//         <p className="text-gray-400 mt-2">
//           Manage integrations, team permissions and AI agent behavior.
//         </p>
//       </div>
 
//       {/* Top Grid */}
 
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Integrations */}
 
//         <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//           <h2 className="text-xl font-bold mb-6">
//             🔗 Integrations
//           </h2>
 
//           <div className="space-y-1">
//             {integrations.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between items-center py-4 border-b border-slate-700 last:border-0"
//               >
//                 <div>
//                   <h3 className="font-semibold text-white">
//                     {item.name}
//                   </h3>
 
//                   <p className="text-sm text-gray-400">
//                     {item.desc}
//                   </p>
//                 </div>
 
//                 <span
//                   className={`px-3 py-1 rounded-lg text-xs font-bold ${
//                     item.status === "CONNECTED"
//                       ? "bg-green-500/20 text-green-400"
//                       : "bg-gray-500/20 text-gray-400"
//                   }`}
//                 >
//                   {item.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
 
//         {/* Agent Preferences */}
 
//         <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//           <h2 className="text-xl font-bold mb-6">
//             🤖 Agent Preferences
//           </h2>
 
//           <div className="space-y-5">
//             {preferences.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between items-center"
//               >
//                 <span className="text-gray-200">
//                   {item}
//                 </span>
 
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     defaultChecked={index !== 0}
//                     className="sr-only peer"
//                   />
 
//                   <div className="w-12 h-7 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500 transition-all"></div>
 
//                   <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-5"></div>
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
 
//       {/* Team & Access */}
 
//       <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//         <h2 className="text-xl font-bold mb-6">
//           👥 Team & Access
//         </h2>
 
//         <div className="space-y-5">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold">
//                 Pankaj Kumar
//               </h3>
 
//               <p className="text-gray-400">
//                 pankaj@pravraha.com
//               </p>
//             </div>
 
//             <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
//               ADMIN
//             </span>
//           </div>
 
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold">
//                 Milind Kamboj
//               </h3>
 
//               <p className="text-gray-400">
//                 milind@pravraha.com
//               </p>
//             </div>
 
//             <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg font-semibold">
//               CTO
//             </span>
//           </div>
 
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold">
//                 Priyanka Kumari
//               </h3>
 
//               <p className="text-gray-400">
//                 priyanka@pravraha.com
//               </p>
//             </div>
 
//             <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg font-semibold">
//               COO
//             </span>
//           </div>
//         </div>
//       </div>
 
//       {/* Email Infrastructure */}
 
//       <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//         <h2 className="text-xl font-bold mb-6">
//           📧 Email Infrastructure
//         </h2>
 
//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <span>SendGrid Connected</span>
 
//             <span className="text-green-400 font-bold">
//               ACTIVE
//             </span>
//           </div>
 
//           <div className="flex justify-between">
//             <span>Domain Warming</span>
 
//             <span className="text-cyan-400 font-bold">
//               COMPLETE
//             </span>
//           </div>
 
//           <div className="flex justify-between">
//             <span>Daily Send Limit</span>
 
//             <span className="text-green-400 font-bold">
//               1,500/day
//             </span>
//           </div>
//         </div>
 
//         <div className="mt-6">
//           <div className="flex justify-between text-sm mb-2">
//             <span>Email Health Score</span>
 
//             <span className="text-green-400">
//               92%
//             </span>
//           </div>
 
//           <div className="h-3 bg-[#24304A] rounded-full overflow-hidden">
//             <div
//               className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
//               style={{ width: "92%" }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import api from "../services/api";
 
// export default function Settings() {
//   const [loading, setLoading] = useState(true);
 
//   const [settings, setSettings] = useState({
//     integrations: [],
//     preferences: [],
//     teamMembers: [],
//     emailInfrastructure: {
//       sendGridConnected: "",
//       domainWarming: "",
//       dailySendLimit: "",
//       healthScore: 0,
//     },
//   });
 
//   useEffect(() => {
//     fetchSettings();
//   }, []);
 
//   const fetchSettings = async () => {
//     try {
//       const response = await api.get("/settings");
 
//       if (response.data?.success) {
//         setSettings(
//           response.data.data || {
//             integrations: [],
//             preferences: [],
//             teamMembers: [],
//             emailInfrastructure: {
//               sendGridConnected: "",
//               domainWarming: "",
//               dailySendLimit: "",
//               healthScore: 0,
//             },
//           }
//         );
//       }
//     } catch (error) {
//       console.error("Settings Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   if (loading) {
//     return (
//       <div className="text-white text-xl">
//         Loading Settings...
//       </div>
//     );
//   }
 
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-4xl font-bold text-white">
//           Settings & Integrations
//         </h1>
 
//         <p className="text-gray-400 mt-2">
//           Manage integrations, team permissions and AI agent behavior.
//         </p>
//       </div>
 
//       {/* Integrations */}
//       <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//         <h2 className="text-xl font-bold mb-6">
//           🔗 Integrations
//         </h2>
 
//         <div className="space-y-2">
//           {settings.integrations?.map((item) => (
//             <div
//               key={item._id}
//               className="flex justify-between items-center py-4 border-b border-slate-700"
//             >
//               <div>
//                 <h3 className="font-semibold text-white">
//                   {item.name}
//                 </h3>
 
//                 <p className="text-sm text-gray-400">
//                   {item.desc}
//                 </p>
//               </div>
 
//               <span
//                 className={`px-3 py-1 rounded-lg text-xs font-bold ${
//                   item.status === "CONNECTED"
//                     ? "bg-green-500/20 text-green-400"
//                     : "bg-gray-500/20 text-gray-400"
//                 }`}
//               >
//                 {item.status}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
 
//       {/* Preferences */}
//       <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//         <h2 className="text-xl font-bold mb-6">
//           🤖 Agent Preferences
//         </h2>
 
//         <div className="space-y-5">
//           {settings.preferences?.map((item) => (
//             <div
//               key={item._id}
//               className="flex justify-between items-center"
//             >
//               <span className="text-gray-200">
//                 {item.label}
//               </span>
 
//               <span
//                 className={
//                   item.enabled
//                     ? "text-green-400 font-bold"
//                     : "text-red-400 font-bold"
//                 }
//               >
//                 {item.enabled
//                   ? "ENABLED"
//                   : "DISABLED"}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
 
//       {/* Team Members */}
//       <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//         <h2 className="text-xl font-bold mb-6">
//           👥 Team & Access
//         </h2>
 
//         <div className="space-y-5">
//           {settings.teamMembers?.map((member) => (
//             <div
//               key={member._id}
//               className="flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold">
//                   {member.name}
//                 </h3>
 
//                 <p className="text-gray-400">
//                   {member.email}
//                 </p>
//               </div>
 
//               <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
//                 {member.role}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
 
//       {/* Email Infrastructure */}
//       <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//         <h2 className="text-xl font-bold mb-6">
//           📧 Email Infrastructure
//         </h2>
 
//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <span>SendGrid Connected</span>
 
//             <span className="text-green-400 font-bold">
//               {settings.emailInfrastructure?.sendGridConnected}
//             </span>
//           </div>
 
//           <div className="flex justify-between">
//             <span>Domain Warming</span>
 
//             <span className="text-cyan-400 font-bold">
//               {settings.emailInfrastructure?.domainWarming}
//             </span>
//           </div>
 
//           <div className="flex justify-between">
//             <span>Daily Send Limit</span>
 
//             <span className="text-green-400 font-bold">
//               {settings.emailInfrastructure?.dailySendLimit}
//             </span>
//           </div>
//         </div>
 
//         <div className="mt-6">
//           <div className="flex justify-between text-sm mb-2">
//             <span>Email Health Score</span>
 
//             <span className="text-green-400">
//               {settings.emailInfrastructure?.healthScore}%
//             </span>
//           </div>
 
//           <div className="h-3 bg-[#24304A] rounded-full overflow-hidden">
//             <div
//               className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
//               style={{
//                 width: `${settings.emailInfrastructure?.healthScore || 0}%`,
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
 
 
 
import useSettings from "../hooks/queries/useSettings";
import IntegrationsCard from "../components/settings/IntegrationsCard";
import AgentPreferencesCard from "../components/settings/AgentPreferencesCard";
import TeamAccessCard from "../components/settings/TeamAccessCard";
import EmailInfrastructureCard from "../components/settings/EmailInfrastructureCard";
 
// **************************CHANGE************************** //
 
// export default function Settings() {
//   const [loading, setLoading] = useState(true);
 
//   const [settings, setSettings] = useState({
//     integrations: [],
//     preferences: [],
//     teamMembers: [],
//     emailInfrastructure: {
//       sendGridConnected: "",
//       domainWarming: "",
//       dailySendLimit: "",
//       healthScore: 0,
//     },
//   });
 
export default function Settings() {
  const { loading, settings } = useSettings();

 
 
  // **************************CHANGE************************** //
 
 
 
  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading Settings...
      </div>
    );
  }

 
  return (
      <div className="space-y-6 text-white">
    <h1>SETTINGS PAGE</h1>
 
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
  <IntegrationsCard
    integrations={settings?.integrations || []}
  />
 
  <AgentPreferencesCard
    preferences={settings?.preferences || []}
  />
 
  <TeamAccessCard
    teamMembers={settings?.teamMembers || []}
  />
 
</div>
 
<EmailInfrastructureCard
  emailInfrastructure={
    settings?.emailInfrastructure || {}
  }
/>
  </div>
);
   
}