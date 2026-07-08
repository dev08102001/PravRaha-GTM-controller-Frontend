
// export default function PipelineHeader({ stats }) {
//   return (
//     <div className="flex justify-between items-center flex-wrap gap-4">
//       <div>
//         <h1 className="text-3xl font-bold text-white">Pipeline</h1>
//         <p className="text-gray-400 mt-1">
//           {stats.totalCompanies} companies tracked • {stats.meetingsBooked}{" "}
//           meetings booked • {stats.pipelineGenerated} pipeline generated
//         </p>
//       </div>
//       <div className="flex gap-3">
//         <button className="border border-gray-600 px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition">
//           Filter
//         </button>
//         <button className="bg-[#1C2538] px-4 py-2 rounded-lg text-white hover:bg-[#2A3550] transition">
//           ← Campaigns
//         </button>
//       </div>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";

export default function PipelineHeader({ stats }) {
  const navigate = useNavigate();

  const handleFilter = () => {
    alert("Filter clicked");
  };

  const handleCampaigns = () => {
    navigate("/campaigns");
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Pipeline
        </h1>

        <p className="text-gray-400 mt-1">
          {stats.totalCompanies} companies tracked • {stats.meetingsBooked}{" "}
          meetings booked • {stats.pipelineGenerated} pipeline generated
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleFilter}
          className="border border-gray-600 px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition"
        >
          Filter
        </button>

        <button
          onClick={handleCampaigns}
          className="bg-[#1C2538] px-4 py-2 rounded-lg text-white hover:bg-[#2A3550] transition"
        >
          ← Campaigns
        </button>
      </div>
    </div>
  );
}
