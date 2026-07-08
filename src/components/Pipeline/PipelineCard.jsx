// import { getTagStyle } from "../../utils/pipelineUtils";
// export default function PipelineCard({ item }) {
//   return (
//     <div className="bg-[#1C2538] border border-[#34415f] rounded-xl p-4 shadow-sm hover:shadow-md transition">
//       <div className="font-bold text-white mb-1">{item.company}</div>
//       <div className="text-sm text-gray-400 mb-3">{item.role}</div>
//       <div className="flex justify-between items-end">
//         <span
//           className={`text-[11px] px-2 py-1 rounded border font-semibold ${getTagStyle(
//             item.tag
//           )}`}
//         >
//           {item.tag}
//         </span>
//         <span className="font-bold text-yellow-300">{item.score}</span>
//       </div>
//     </div>
//   );
// }

// import { getTagStyle } from "../../utils/pipelineUtils";

// export default function PipelineCard({ item }) {
//   const handleCardClick = () => {
//     alert(`Opening ${item.company}`);
//   };

//   const handleEdit = (e) => {
//     e.stopPropagation();
//     alert(`Edit ${item.company}`);
//   };

//   const handleDelete = (e) => {
//     e.stopPropagation();

//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${item.company}"?`
//     );

//     if (confirmed) {
//       alert(`${item.company} deleted`);
//     }
//   };

//   return (
//     <div
//       onClick={handleCardClick}
//       className="bg-[#1C2538] border border-[#34415f] rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
//     >
//       <div className="font-bold text-white mb-1">
//         {item.company}
//       </div>

//       <div className="text-sm text-gray-400 mb-3">
//         {item.role}
//       </div>

//       <div className="flex justify-between items-end">
//         <span
//           className={`text-[11px] px-2 py-1 rounded border font-semibold ${getTagStyle(
//             item.tag
//           )}`}
//         >
//           {item.tag}
//         </span>

//         <span className="font-bold text-yellow-300">
//           {item.score}
//         </span>
//       </div>

//       <div className="flex gap-2 mt-4">
//         <button
//           onClick={handleEdit}
//           className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs text-white"
//         >
//           ✏️ Edit
//         </button>

//         <button
//           onClick={handleDelete}
//           className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs text-white"
//         >
//           🗑 Delete
//         </button>
//       </div>
//     </div>
//   );
// }
import { getTagStyle } from "../../utils/pipelineUtils";

export default function PipelineCard({ item }) {
  const handleCardClick = () => {
    alert(`Opening ${item.company}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#1C2538] border border-[#34415f] rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="font-bold text-white mb-1">
        {item.company}
      </div>

      <div className="text-sm text-gray-400 mb-3">
        {item.role}
      </div>

      <div className="flex justify-between items-end">
        <span
          className={`text-[11px] px-2 py-1 rounded border font-semibold ${getTagStyle(
            item.tag
          )}`}
        >
          {item.tag}
        </span>

        <span className="font-bold text-yellow-300">
          {item.score}
        </span>
      </div>
    </div>
  );
}
