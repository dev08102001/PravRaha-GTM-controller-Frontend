
// import PipelineCard from "./PipelineCard";

// export default function PipelineColumn({ stage, companies }) {
//   return (
//     <div className="bg-[#151D2E] border border-[#2A3550] rounded-xl p-4 w-[280px] shrink-0">
//       <div className="flex justify-between items-center mb-5">
//         <h2 className="font-bold uppercase text-sm tracking-wide text-white">
//           {stage}
//         </h2>
//         <span className="bg-[#1C2538] px-2 py-1 rounded text-xs text-gray-300">
//           {companies?.length || 0}
//         </span>
//       </div>
//       <div className="space-y-4">
//         {companies?.map((item) => (
//           <PipelineCard key={item._id} item={item} />
//         ))}
//       </div>
//     </div>
//   );
// }


import toast from "react-hot-toast";
import PipelineCard from "./PipelineCard";

export default function PipelineColumn({ stage, companies }) {
  const handleStageClick = () => {
    toast.success(`Stage: ${stage}`);
  };

  const handleCountClick = () => {
    toast.success(
      `${companies?.length || 0} companies in ${stage}`
    );
  };

  return (
    <div className="bg-[#151D2E] border border-[#2A3550] rounded-xl p-4 w-[280px] shrink-0">
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={handleStageClick}
          className="font-bold uppercase text-sm tracking-wide text-white hover:text-cyan-400 transition"
        >
          {stage}
        </button>

        <button
          onClick={handleCountClick}
          className="bg-[#1C2538] px-2 py-1 rounded text-xs text-gray-300 hover:bg-[#30405F] transition"
        >
          {companies?.length || 0}
        </button>
      </div>

      <div className="space-y-4">
        {companies?.map((item) => (
          <PipelineCard
            key={item._id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
