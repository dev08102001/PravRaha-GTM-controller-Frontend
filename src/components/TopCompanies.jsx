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

import { useEffect, useState } from "react";
import useTopCompanies from "../hooks/queries/useTopCompanies";

export default function TopCompanies() {
  // Initialise from the last campaign-goal prompt (if any), then react to new
  // prompts launched from the Campaign Goal card on the dashboard.
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem("gtm:lastPrompt") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    const onPrompt = (e) => setQuery(e.detail || "");
    window.addEventListener("gtm:prompt", onPrompt);
    return () => window.removeEventListener("gtm:prompt", onPrompt);
  }, []);

  const { data, isLoading, isError } = useTopCompanies(query);
  const companies = data?.items || [];

  const Header = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>🏢</span> Top Target Companies
        </h2>
      </div>
      <p className="text-gray-400 text-sm mt-1">
        {query
          ? `Companies related to “${query}”`
          : "Highest-intent accounts from your database"}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
        <Header />
        <div className="text-gray-400">Loading companies...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
        <Header />
        <div className="text-red-400">Failed to load companies.</div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
        <Header />
        <div className="text-gray-400">
          {query
            ? "No companies match that prompt. Try a broader term like “software” or “fintech”."
            : "No target companies available."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
      <Header />

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
                  {company.employees || "Unknown"} employees
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