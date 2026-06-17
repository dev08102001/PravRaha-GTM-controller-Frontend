// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // export default function TopCompanies() {
// //   const [companies, setCompanies] = useState([]);

// //   useEffect(() => {
// //     fetchCompanies();
// //   }, []);

// //   const fetchCompanies = async () => {
// //     try {
// //       const res = await axios.get(
// //         "http://localhost:9077/api/companies"
// //       );

// //       setCompanies(res.data);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   return (
// //     <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-2xl font-bold">
// //           🏢 Top Target Companies
// //         </h2>

// //         <button className="text-cyan-400 text-sm hover:text-cyan-300">
// //           View All →
// //         </button>
// //       </div>

// //       <div className="space-y-4">
// //         {companies.map((company, index) => (
// //           <div
// //             key={company._id}
// //             className="bg-[#24304A] border border-slate-600 rounded-xl p-4"
// //           >
// //             <div className="flex justify-between items-start">
// //               <div>
// //                 <div className="flex items-center gap-3">
// //                   <span className="text-gray-500 font-bold">
// //                     #{index + 1}
// //                   </span>

// //                   <h3 className="font-bold text-lg">
// //                     {company.name}
// //                   </h3>
// //                 </div>

// //                 <div className="text-sm text-gray-400 mt-2">
// //                   {company.employees} employees
// //                 </div>

// //                 <span className="inline-block mt-3 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
// //                   {company.signal}
// //                 </span>
// //               </div>

// //               <div className="text-right">
// //                 <div className="text-yellow-400 text-2xl font-bold">
// //                   {company.score}
// //                 </div>

// //                 <div className="text-xs text-gray-500">
// //                   Intent
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }






// import useCompanies from "../hooks/queries/useCompanies";

// export default function TopCompanies() {
//   const { data: companies = [] } = useCompanies();

//   return (
//     <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">
//           🏢 Top Target Companies
//         </h2>

//         <button className="text-cyan-400 text-sm hover:text-cyan-300">
//           View All →
//         </button>
//       </div>

//       <div className="space-y-4">
//         {companies.map((company, index) => (
//           <div
//             key={company._id}
//             className="bg-[#24304A] border border-slate-600 rounded-xl p-4"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-gray-500 font-bold">
//                     #{index + 1}
//                   </span>

//                   <h3 className="font-bold text-lg">
//                     {company.name}
//                   </h3>
//                 </div>

//                 <div className="text-sm text-gray-400 mt-2">
//                   {company.employees} employees
//                 </div>

//                 <span className="inline-block mt-3 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
//                   {company.signal}
//                 </span>
//               </div>

//               <div className="text-right">
//                 <div className="text-yellow-400 text-2xl font-bold">
//                   {company.score}
//                 </div>

//                 <div className="text-xs text-gray-500">
//                   Intent
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import useCompanies from "../hooks/queries/useCompanies";

export default function TopCompanies() {
  const {
    data: companies = [],
    isLoading,
    isError,
  } = useCompanies();

  const handleViewAll = () => {
    alert("View All clicked");
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
        Loading companies...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-red-400">
        Failed to load companies.
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-gray-400">
        No target companies available.
      </div>
    );
  }

  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          🏢 Top Target Companies
        </h2>

        <button
          onClick={handleViewAll}
          className="text-cyan-400 text-sm hover:text-cyan-300"
        >
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {companies.map((company, index) => (
          <div
            key={company._id}
            className="bg-[#24304A] border border-slate-600 rounded-xl p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-bold">
                    #{index + 1}
                  </span>

                  <h3 className="font-bold text-lg">
                    {company.name}
                  </h3>
                </div>

                <div className="text-sm text-gray-400 mt-2">
                  {(company.employees ?? 0).toLocaleString()} employees
                </div>

                <span className="inline-block mt-3 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
                  {company.signal || "No Signal"}
                </span>
              </div>

              <div className="text-right">
                <div className="text-yellow-400 text-2xl font-bold">
                  {company.score ?? 0}
                </div>

                <div className="text-xs text-gray-500">
                  Intent
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}