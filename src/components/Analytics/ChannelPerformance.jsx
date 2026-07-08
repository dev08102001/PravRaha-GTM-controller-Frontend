

 
// export default function ChannelPerformance({ channelData }) {
//   return (
//     <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border border-slate-700">
//       <h2 className="text-xl font-bold mb-6">Channel Performance</h2>
 
//       <div className="space-y-6">
//         {channelData?.map((item, idx) => (
//           <div key={item?.name ?? idx}>
//             <div className="flex justify-between mb-2">
//               <span>{item.name}</span>
//               <span className="font-semibold">{item.rate}</span>
//             </div>
 
//             <div className="bg-[#24304A] h-4 rounded-full overflow-hidden">
//               <div
//                 className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full"
//                 style={{ width: item.width ?? item.rate ?? "20%" }}
//               />
//             </div>
 
//             <p className="text-xs text-gray-400 mt-2">{item.replies} replies</p>
//           </div>
//         ))}
 
//         <div className="text-sm text-gray-400 pt-3">Data pulled from Analytics collection</div>
//       </div>
//     </div>
//   );
// }
 
 
 
export default function ChannelPerformance({ channelData = [] }) {
  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold mb-6">Channel Performance</h2>
 
      <div className="space-y-6">
        {channelData.map((item, idx) => {
          const width =
            typeof item.rate === "number"
              ? `${item.rate}%`
              : item.rate || "20%";
 
          return (
            <div key={item.name || idx}>
              <div className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span className="font-semibold">{item.rate}</span>
              </div>
 
              <div className="bg-[#24304A] h-4 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full"
                  style={{ width }}
                />
              </div>
 
              <p className="text-xs text-gray-400 mt-2">
                {item.replies || 0} replies
              </p>
            </div>
          );
        })}
      </div>
 
      <p className="text-xs text-gray-500 mt-4">
        Data from analytics API
      </p>
    </div>
  );
}
 