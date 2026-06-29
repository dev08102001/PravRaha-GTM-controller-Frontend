

// import { useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";

// import useCampaigns from "../hooks/queries/useCampaigns";
// import NewCampaignModal from "../components/NewCampaignModal";

// export default function Campaigns() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const queryClient = useQueryClient();

//   const {
//     data: campaigns = [],
//     isLoading,
//     isError,
//   } = useCampaigns();

//   const runningCount = campaigns.filter(
//     (c) => c.status === "RUNNING"
//   ).length;

//   const pausedCount = campaigns.filter(
//     (c) => c.status === "PAUSED"
//   ).length;

//   const completedCount = campaigns.filter(
//     (c) => c.status === "COMPLETED"
//   ).length;

//   if (isLoading) {
//     return (
//       <div className="text-white text-xl">
//         Loading Campaigns...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-red-500 text-xl">
//         Failed to load campaigns
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div>
//           <h1 className="text-4xl font-bold text-white">
//             Campaigns
//           </h1>

//           <p className="text-gray-400 mt-2">
//             {runningCount} running • {pausedCount} paused •{" "}
//             {completedCount} completed
//           </p>
//         </div>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition"
//         >
//           + New Campaign
//         </button>
//       </div>

//       {/* Empty State */}
//       {campaigns.length === 0 && (
//         <div className="bg-[#151D2E] rounded-2xl p-8 text-center">
//           <h2 className="text-2xl font-bold text-white">
//             No Campaigns Found
//           </h2>

//           <p className="text-gray-400 mt-2">
//             Create your first campaign using Postman
//             or the New Campaign button.
//           </p>
//         </div>
//       )}

//       {/* Campaign Cards */}
//       {campaigns.map((campaign) => (
//         <div
//           key={campaign._id}
//           className={`bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border-l-4 ${campaign.border}`}
//         >
//           <div className="flex justify-between items-start flex-wrap gap-4">
//             <div>
//               <h2 className="text-2xl font-bold text-white">
//                 {campaign.title}
//               </h2>

//               <p className="text-gray-400 mt-2">
//                 {campaign.description}
//               </p>
//             </div>

//             <div className="flex gap-3 flex-wrap">
//               <span
//                 className={`px-4 py-2 rounded-lg text-xs font-bold ${
//                   campaign.status === "RUNNING"
//                     ? "bg-green-500/20 text-green-400"
//                     : campaign.status === "PAUSED"
//                     ? "bg-yellow-500/20 text-yellow-400"
//                     : "bg-blue-500/20 text-blue-400"
//                 }`}
//               >
//                 {campaign.status}
//               </span>

//               <button className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-lg">
//                 {campaign.status === "RUNNING"
//                   ? "❚❚ Pause"
//                   : "▶ Resume"}
//               </button>

//               <button className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-lg">
//                 Details →
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mt-8">
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">
//                 Companies
//               </p>

//               <p className="text-4xl font-bold text-white mt-2">
//                 {campaign.companies}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">
//                 Buyers Found
//               </p>

//               <p className="text-4xl font-bold text-white mt-2">
//                 {campaign.buyersFound}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">
//                 Msgs Generated
//               </p>

//               <p className="text-4xl font-bold text-white mt-2">
//                 {campaign.msgsGenerated}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">
//                 Msgs Sent
//               </p>

//               <p className="text-4xl font-bold text-white mt-2">
//                 {campaign.msgsSent}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">
//                 Replies
//               </p>

//               <p className="text-4xl font-bold text-white mt-2">
//                 {campaign.replies}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">
//                 Meetings
//               </p>

//               <p className="text-4xl font-bold text-white mt-2">
//                 {campaign.meetings}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 mt-6">
//             {campaign.tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="bg-[#24304A] px-3 py-1 rounded-lg text-xs text-gray-300"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>

//           <div className="mt-6">
//             <div className="h-3 bg-[#24304A] rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 rounded-full"
//                 style={{
//                   width: `${campaign.progress}%`,
//                 }}
//               />
//             </div>
//           </div>

//           <div className="flex justify-between mt-3 text-sm text-gray-400">
//             <span>
//               Started {campaign.started}
//             </span>

//             <span>
//               {campaign.progress}% to goal
//             </span>
//           </div>
//         </div>
//       ))}

//       <NewCampaignModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={() => {
//           setIsModalOpen(false);

//           queryClient.invalidateQueries({
//             queryKey: ["campaigns"],
//           });
//         }}
//       />
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useCampaigns from "../hooks/queries/useCampaigns";
import NewCampaignModal from "../components/NewCampaignModal";

export default function Campaigns() {
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const currentRole =
    currentUser.role?.toLowerCase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: campaigns = [],
    isLoading,
    isError,
  } = useCampaigns();

  const runningCount = campaigns.filter(
  (c) => c.status === "running"
).length;

const pausedCount = campaigns.filter(
  (c) => c.status === "paused"
).length;

const completedCount = campaigns.filter(
  (c) => c.status === "completed"
).length;

  // Button Handlers
  const handlePauseResume = async (campaign) => {
  const newStatus =
  campaign.status === "running"
    ? "paused"
    : "running";

  try {
    await api.patch(`/campaigns/${campaign._id}/status`, {
      status: newStatus,
    });

    await queryClient.invalidateQueries({
      queryKey: ["campaigns"],
  });
  } catch (error) {
    console.error(error);
    alert("Failed to update campaign status");
  }
};

  const navigate = useNavigate();

  const handleDetails = (campaign) => {
    navigate(`/campaigns/${campaign._id}`);
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleDelete = async (campaign) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${campaign.title}"?`
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/campaigns/${campaign._id}`);

    await queryClient.invalidateQueries({
      queryKey: ["campaigns"],
    });

    alert("Campaign deleted successfully");
  } catch (error) {
    console.error("Delete Error:", error);
    alert("Failed to delete campaign");
  }
};

  if (isLoading) {
    return (
      <div className="text-white text-xl">
        Loading Campaigns...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-xl">
        Failed to load campaigns
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Campaigns
          </h1>

          <p className="text-gray-400 mt-2">
            {runningCount} running • {pausedCount} paused •{" "}
            {completedCount} completed
          </p>
        </div>

      {currentRole !== "user" && (
        <button
          onClick={() => {
            setEditingCampaign(null);
            setIsModalOpen(true);
          }}
          className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition"
        >
          + New Campaign
        </button>
      )}
      </div>

      {/* Empty State */}
      {campaigns.length === 0 && (
        <div className="bg-[#151D2E] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            No Campaigns Found
          </h2>

          <p className="text-gray-400 mt-2">
            Create your first campaign using Postman
            or the New Campaign button.
          </p>
        </div>
      )}

      {/* Campaign Cards */}
      {campaigns.map((campaign) => (
        <div
          key={campaign._id}
          className={`bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border-l-4 ${campaign.border}`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-white">
                {campaign.title}
              </h2>

              <p className="text-gray-400 mt-2 line-clamp-2 max-w-2xl">
                {campaign.description}
              </p>
            </div>

            <div className="flex gap-3 justify-end items-center shrink-0">
            <button
          className={`px-4 py-2 rounded-lg text-xs font-bold ${
  campaign.status === "running"
    ? "bg-green-500/20 text-green-400"
    : campaign.status === "paused"
    ? "bg-yellow-500/20 text-yellow-400"
    : "bg-blue-500/20 text-blue-400"
}`}
            >
              {campaign.status?.toUpperCase()}
            </button>

              {currentRole !== "user" && (
                <button
                  onClick={() => handlePauseResume(campaign)}
                  className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-lg"
                >
                  {campaign.status === "running"
  ? "❚❚ Pause"
  : "▶ Resume"}
                </button>
              )}

                  {currentRole !== "user" && (
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
                    >
                    ✏️ Edit
                   </button>
                  )}

                  {currentRole === "super_admin" && (
                    <button
                      onClick={() => handleDelete(campaign)}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
                   >
                    🗑 Delete
                  </button>
                  )}

              <button
                onClick={() => handleDetails(campaign)}
                className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-lg"
              >
                Details →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mt-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Companies
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {campaign.companies}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Buyers Found
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {campaign.buyersFound}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Msgs Generated
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {campaign.msgsGenerated}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Msgs Sent
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {campaign.msgsSent}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Replies
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {campaign.replies}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Meetings
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {campaign.meetings}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {(campaign.tags || []).map((tag) => (
              <span
                key={tag}
                className="bg-[#24304A] px-3 py-1 rounded-lg text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <div className="h-3 bg-[#24304A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${campaign.progress}%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-3 text-sm text-gray-400">
            <span>
              Started {campaign.started}
            </span>

            <span>
              {campaign.msgsGenerated > 0
                ? `${campaign.msgsSent} / ${campaign.msgsGenerated} sent · `
                : ""}
              {campaign.progress}% to goal
            </span>
          </div>
        </div>
      ))}

      {currentRole !== "user" && (
  <NewCampaignModal
    isOpen={isModalOpen}
    campaign={editingCampaign}
    onClose={() => {
      setEditingCampaign(null);
      setIsModalOpen(false);
    }}
    onSuccess={async () => {
      setEditingCampaign(null);
      setIsModalOpen(false);

      await queryClient.invalidateQueries({
        queryKey: ["campaigns"],
      });
    }}
  />
)}
    </div>
  );
}