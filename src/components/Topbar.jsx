// export default function Topbar() {
//   return (
//     <div className="bg-[#0E1422] border-b border-gray-800 px-6 py-4 flex items-center justify-between">

//       <div>
//         <h1 className="text-2xl font-bold text-white">
//           GTM Control Center
//         </h1>

//         <p className="text-sm text-gray-400 mt-1">
//           AI-Powered Revenue Infrastructure
//         </p>
//       </div>

//       <div className="flex items-center gap-3">

//         <button className="px-4 py-2 bg-[#151D2E] hover:bg-[#1C2538] border border-gray-700 rounded-lg text-white transition">
//           🔄 Sync Data
//         </button>

//         <button className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition">
//           + New Campaign
//         </button>

//       </div>

//     </div>
//   );
// }
export default function Topbar() {
  const handleSync = () => {
    alert("Sync Data clicked");
  };

  const handleNewCampaign = () => {
    alert("New Campaign clicked");
  };

  return (
    <div className="bg-[#0E1422] border-b border-gray-800 px-6 py-4 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold text-white">
          GTM Control Center
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          AI-Powered Revenue Infrastructure
        </p>
      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={handleSync}
          className="px-4 py-2 bg-[#151D2E] hover:bg-[#1C2538] border border-gray-700 rounded-lg text-white transition"
        >
          🔄 Sync Data
        </button>

        <button
          onClick={handleNewCampaign}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition"
        >
          + New Campaign
        </button>

      </div>

    </div>
  );
}