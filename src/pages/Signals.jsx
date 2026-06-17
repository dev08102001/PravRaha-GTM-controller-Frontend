// // import { useEffect, useState } from "react";
// // import api from "../services/api";

// // export default function Signals() {
// //   const [signals, setSignals] = useState([]);

// //   useEffect(() => {
// //     fetchSignals();
// //   }, []);

// //   const fetchSignals = async () => {
// //     try {
// //       const response = await api.get("/signals");

// //       const formattedSignals = response.data.map((signal) => ({
// //         ...signal,

// //         badge:
// //           signal.type === "Funding"
// //             ? "SERIES C"
// //             : signal.type === "Hiring"
// //             ? "HIRING SURGE"
// //             : "TECH CHANGE",

// //         description: signal.signal,

// //         employees:
// //           signal.company === "Retool"
// //             ? "200-500 employees"
// //             : signal.company === "Linear"
// //             ? "50-200 employees"
// //             : signal.company === "Cal.com"
// //             ? "10-50 employees"
// //             : "100-300 employees",

// //         location:
// //           signal.company === "Cal.com"
// //             ? "Remote"
// //             : "San Francisco, CA",

// //         time:
// //           signal.company === "Retool"
// //             ? "2h ago"
// //             : signal.company === "Linear"
// //             ? "3h ago"
// //             : signal.company === "Cal.com"
// //             ? "5h ago"
// //             : "4h ago",
// //       }));

// //       setSignals(formattedSignals);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   const badgeStyle = (type) => {
// //     switch (type) {
// //       case "Funding":
// //         return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";

// //       case "Hiring":
// //         return "bg-green-500/20 text-green-300 border-green-500/30";

// //       default:
// //         return "bg-blue-500/20 text-blue-300 border-blue-500/30";
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}

// //       <div className="flex justify-between items-start flex-wrap gap-4">
// //         <div>
// //           <h1 className="text-4xl font-bold text-white">
// //             Signal Feed
// //           </h1>

// //           <p className="text-gray-400 mt-2">
// //             1204 signals detected • 12 high-priority • Powered by Draup + 100
// //             sources
// //           </p>
// //         </div>

// //         <button className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold transition">
// //           Refresh Signals
// //         </button>
// //       </div>

// //       {/* Filters */}

// //       <div className="flex gap-3 flex-wrap">
// //         <button className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-xl">
// //           All
// //         </button>

// //         <button className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-xl">
// //           Funding
// //         </button>

// //         <button className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-xl">
// //           Hiring
// //         </button>

// //         <button className="bg-[#24304A] hover:bg-[#30405F] px-4 py-2 rounded-xl">
// //           Tech Change
// //         </button>
// //       </div>

// //       {/* Signal Cards */}

// //       {signals.map((signal, index) => (
// //         <div
// //           key={index}
// //           className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6 flex justify-between items-center"
// //         >
// //           <div className="flex-1">
// //             <div className="flex items-center gap-3 mb-3">
// //               <h2 className="font-bold text-2xl text-white">
// //                 {signal.company}
// //               </h2>

// //               <span
// //                 className={`text-xs px-3 py-1 rounded-full border font-semibold ${badgeStyle(
// //                   signal.type
// //                 )}`}
// //               >
// //                 {signal.badge}
// //               </span>
// //             </div>

// //             <p className="text-white font-medium text-lg">
// //               {signal.description}
// //             </p>

// //             <p className="text-gray-400 text-sm mt-3">
// //               {signal.employees}
// //               {" • "}
// //               {signal.location}
// //               {" • "}
// //               {signal.time}
// //             </p>
// //           </div>

// //           <div className="text-right ml-8">
// //             <div className="text-green-400 text-5xl font-bold">
// //               {signal.score}
// //             </div>

// //             <div className="text-gray-400 text-sm mb-4">
// //               Intent Score
// //             </div>

// //             <button className="bg-teal-600 hover:bg-teal-700 px-5 py-3 rounded-xl text-sm font-medium transition">
// //               + Add to Sequence
// //             </button>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }







// /*
// ==========================================================
// DYNAMIC SIGNAL FEED IMPLEMENTATION
// ==========================================================
 
// Changes from static version:
 
// 1. Removed hardcoded company metadata.
// 2. Uses backend API data directly.
// 3. Added signal type filtering.
// 4. Added active filter highlighting.
// 5. Added filtered rendering.
// 6. Added API response debugging.
 
// ==========================================================
// */
 
 
// import { useEffect, useState } from "react";
// import api from "../services/api";
 
// export default function Signals() {
//   const [signals, setSignals] = useState([]);
//   // CHANGE: Added state to track currently selected signal type filter
// // Used by filter buttons (All, Funding, Hiring, Tech Change)
//   const [selectedFilter, setSelectedFilter] = useState("All");
 
//   useEffect(() => {
//     fetchSignals();
//   }, []);
 
//   const fetchSignals = async () => {
//     try {
//       const response = await api.get("/signals");
// // CHANGE:
// // Added for development/debugging to inspect API response.      
//       console.log(response.data);
 
// // CHANGE:
// // Previous implementation used hardcoded company-specific values.
// // This version uses API-provided values so the Signal Feed
// // automatically reflects backend data.      
 
//       const formattedSignals = response.data.map((signal) => ({
//         ...signal,
// // Display signal type as badge label
//         badge: signal.type,
//   // Map backend signal field to UI description field
//         description: signal.signal,
// // Use API values, fallback to N/A if missing
//         employees: signal.employees || "N/A",
//         location: signal.location || "N/A",
//         time: signal.time || "N/A",
//       }));
 
//       setSignals(formattedSignals);
//     } catch (error) {
//       console.log(error);
//     }
//   };
 
//   const badgeStyle = (type) => {
//     switch (type) {
//       case "Funding":
//         return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
 
//       case "Hiring":
//         return "bg-green-500/20 text-green-300 border-green-500/30";
 
//       default:
//         return "bg-blue-500/20 text-blue-300 border-blue-500/30";
//     }
//   };
 
// // CHANGE:
// // Dynamically filter signals based on selected filter button.
// // "All" returns the full dataset.
//   const filteredSignals =
//     selectedFilter === "All"
//       ? signals
//       : signals.filter(
//         (signal) => signal.type === selectedFilter
//       );
 
//   return (
//     <div className="space-y-6">
//       {/* Header */}
 
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <h1 className="text-4xl font-bold text-white">
//             Signal Feed
//           </h1>
 
//           <p className="text-gray-400 mt-2">
//             1204 signals detected • 12 high-priority • Powered by Draup + 100
//             sources
//           </p>
//         </div>
 
//         <button className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold transition">
//           Refresh Signals
//         </button>
//       </div>
 
//       {/* Filters */}
 
//       <div className="flex gap-3 flex-wrap">
//         <button
//         // CHANGE:
//   // Sets current filter to "All"
//           onClick={() => setSelectedFilter("All")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "All"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           All
//         </button>
 
//         <button
 
//         // CHANGE:
//   // Filters signals where signal.type === "Funding"
//           onClick={() => setSelectedFilter("Funding")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "Funding"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           Funding
//         </button>
 
//         <button
//         // CHANGE:
//   // Filters signals where signal.type === "Hiring"
//           onClick={() => setSelectedFilter("Hiring")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "Hiring"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           Hiring
//         </button>
 
//         <button
//         // CHANGE:
//   // Filters signals where signal.type === "Tech Change"
//           onClick={() => setSelectedFilter("Tech Change")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "Tech Change"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           Tech Change
//         </button>
//       </div>
 
//       {/* Signal Cards */}
 
// {/* // CHANGE:
// // Render filtered dataset instead of full dataset.       */}
     
 
//       {filteredSignals.map((signal, index) => (
//         <div
//           key={index}
//           className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6 flex justify-between items-center"
//         >
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-3">
//               <h2 className="font-bold text-2xl text-white">
//                 {signal.company}
//               </h2>
 
//               <span
//                 className={`text-xs px-3 py-1 rounded-full border font-semibold ${badgeStyle(
//                   signal.type
//                 )}`}
//               >
//                 {signal.badge}
//               </span>
//             </div>
 
//             <p className="text-white font-medium text-lg">
//               {signal.description}
//             </p>
 
//             <p className="text-gray-400 text-sm mt-3">
//               {signal.employees}
//               {" • "}
//               {signal.location}
//               {" • "}
//               {signal.time}
//             </p>
//           </div>
 
//           <div className="text-right ml-8">
//             <div className="text-green-400 text-5xl font-bold">
//               {signal.score}
//             </div>
 
//             <div className="text-gray-400 text-sm mb-4">
//               Intent Score
//             </div>
 
//             <button className="bg-teal-600 hover:bg-teal-700 px-5 py-3 rounded-xl text-sm font-medium transition">
//               + Add to Sequence
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



























 
/*
==========================================================
DYNAMIC SIGNAL FEED IMPLEMENTATION
==========================================================
 
Changes from static version:
 
1. Removed hardcoded company metadata.
2. Uses backend API data directly.
3. Added signal type filtering.
4. Added active filter highlighting.
5. Added filtered rendering.
6. Added API response debugging.
 
==========================================================
*/
 
// ***************************CHANGE**********************
 
// import { useEffect, useState } from "react";
// import api from "../services/api";
 
/*
==========================================================
SIGNAL FEED DATA SOURCE CHANGE
==========================================================
 
Signal Feed now uses the same data source as
Top Target Companies.
 
Benefits:
- Single source of truth
- Consistent company information
- No duplicate mappings
- Future database updates automatically appear
 
==========================================================
*/
 
 
// *************************CHANGE********************
//1. Signal Feed was loading from api.get("/signals")
//  and using const [signals, setSignals] = useState([]);
//  Signal Feed now loads data from the same source as Top Target Companies:
//  const { data: companies = [] } = useCompanies();
//  This keeps Dashboard and signal feed synchronized
//  Companies collections -> Dashbord -> Signal Feed
//  No duplicate data maintenance
 
//2. Added React Query Hook
// Before:  Manual API call
//  useEffect(() => {
//  fetchSignals();
//  }, []);
// After: const { data: companies = [] } = useCompanies();
//Reason
//  React Query handles:
//  fetching
//  caching
//  refetching
//  loading state
 
//3. Removed Hardcoded Signal Formatting
// Before
// The page manually converted:
 
// signal.company === "Retool"
//  ? "200-500 employees"
// and  
// signal.company === "Linear"
// Problem
// Every new company required code changes.
 
// After
// Directly using DataBase Value
// compay.name
// company.employees.....
//  Benefit
// Any MongoDB update appears automatically.
 
//4. Remade Filters
// Added const [selectedFilter, setSelectedFilter] = useState("All");
// and const filteredCompanies =
//  selectedFilter === "All"
//    ? companies
//    : companies.filter(
//        (company) => company.signal === selectedFilter
//      );
//  And allowing filter by All,Series c, Hiring....
 
//5. Changed rendering logic
// Before signals.map(...)
// After filterCopmanies.map(...)
 
//6. Reused Existing Hook src/hooks/queries/useCompanies.js
// Benefit
// Follows existing project structure.
 
// No duplicate hooks.
 
// No duplicate API calls.
//**************************CHANGE******************* */
 
import { useState } from "react";
import useCompanies from "../hooks/queries/useCompanies";
 
// **************************CHANGE***********************
 
// export default function Signals() {
//   const [signals, setSignals] = useState([]);
//   // CHANGE: Added state to track currently selected signal type filter
// // Used by filter buttons (All, Funding, Hiring, Tech Change)
//   const [selectedFilter, setSelectedFilter] = useState("All");
 
export default function Signals() {
 
  /*
  ==========================================================
  COMPANY DATA
 
  Loads company records from the companies collection.
 
  Example record:
 
  {
    name: "Retool",
    employees: "200-500",
    signal: "Series C",
    score: 96
  }
 
  ==========================================================
  */
 
  const { data: companies = [] } = useCompanies();
 
  const [selectedFilter, setSelectedFilter] = useState("All");
 
  const filteredCompanies =
  selectedFilter === "All"
    ? companies
    : companies.filter(
        (company) => company.signal === selectedFilter
      );
 
 
 // ***************************CHANGE*************************
 
 /// COMMENTING useEffect(() => {.................to selectedFilter ,setSelectedFilter
 // Why?  We won't need any of it.
 
//   useEffect(() => {
//     fetchSignals();
//   }, []);
 
//   const fetchSignals = async () => {
//     try {
//       const response = await api.get("/signals");
// // CHANGE:
// // Added for development/debugging to inspect API response.      
//       console.log(response.data);
 
// // CHANGE:
// // Previous implementation used hardcoded company-specific values.
// // This version uses API-provided values so the Signal Feed
// // automatically reflects backend data.      
 
//       const formattedSignals = response.data.map((signal) => ({
//         ...signal,
// // Display signal type as badge label
//         badge: signal.type,
//   // Map backend signal field to UI description field
//         description: signal.signal,
// // Use API values, fallback to N/A if missing
//         employees: signal.employees || "N/A",
//         location: signal.location || "N/A",
//         time: signal.time || "N/A",
//       }));
 
//       setSignals(formattedSignals);
//     } catch (error) {
//       console.log(error);
//     }
//   };
 
//   const badgeStyle = (type) => {
//     switch (type) {
//       case "Funding":
//         return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
 
//       case "Hiring":
//         return "bg-green-500/20 text-green-300 border-green-500/30";
 
//       default:
//         return "bg-blue-500/20 text-blue-300 border-blue-500/30";
//     }
//   };
 
// // CHANGE:
// // Dynamically filter signals based on selected filter button.
// // "All" returns the full dataset.
//   const filteredSignals =
//     selectedFilter === "All"
//       ? signals
//       : signals.filter(
//         (signal) => signal.type === selectedFilter
//       );
// **********************CHANGE********************
//  return is in 389
 
//   return (
//     <div className="space-y-6">
//       {/* Header */}
 
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <h1 className="text-4xl font-bold text-white">
//             Signal Feed
//           </h1>
 
//           <p className="text-gray-400 mt-2">
//             1204 signals detected • 12 high-priority • Powered by Draup + 100
//             sources
//           </p>
//         </div>
 
//         <button className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold transition">
//           Refresh Signals
//         </button>
//       </div>
 
//       {/* Filters */}
 
//       <div className="flex gap-3 flex-wrap">
//         <button
//         // CHANGE:
//   // Sets current filter to "All"
//           onClick={() => setSelectedFilter("All")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "All"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           All
//         </button>
 
//         <button
 
//         // CHANGE:
//   // Filters signals where signal.type === "Funding"
//           onClick={() => setSelectedFilter("Funding")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "Funding"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           Funding
//         </button>
 
//         <button
//         // CHANGE:
//   // Filters signals where signal.type === "Hiring"
//           onClick={() => setSelectedFilter("Hiring")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "Hiring"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           Hiring
//         </button>
 
//         <button
//         // CHANGE:
//   // Filters signals where signal.type === "Tech Change"
//           onClick={() => setSelectedFilter("Tech Change")}
//           className={`px-4 py-2 rounded-xl ${selectedFilter === "Tech Change"
//             ? "bg-orange-500 text-white"
//             : "bg-[#24304A] hover:bg-[#30405F]"
//             }`}
//         >
//           Tech Change
//         </button>
//       </div>
 
      {/* Signal Cards */}
 
{/* // CHANGE:
// Render filtered dataset instead of full dataset.       */}
     
 // ********************************CHANGE******************
 
 return (
  <div className="space-y-6">
 
    {/* Header */}
 
    <div className="flex justify-between items-start flex-wrap gap-4">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Signal Feed
        </h1>
 
        <p className="text-gray-400 mt-2">
          Company intelligence powered by companies collection
        </p>
      </div>
 
      <button className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold transition">
        Refresh Signals
      </button>
    </div>
 
    <div className="flex gap-3 flex-wrap">
 
  <button
    onClick={() => setSelectedFilter("All")}
    className={`px-4 py-2 rounded-xl ${
      selectedFilter === "All"
        ? "bg-orange-500 text-white"
        : "bg-[#24304A]"
    }`}
  >
    All
  </button>
 
  <button
    onClick={() => setSelectedFilter("Series C")}
    className={`px-4 py-2 rounded-xl ${
      selectedFilter === "Series C"
        ? "bg-orange-500 text-white"
        : "bg-[#24304A]"
    }`}
  >
    Series C
  </button>
 
  <button
    onClick={() => setSelectedFilter("Hiring Surge")}
    className={`px-4 py-2 rounded-xl ${
      selectedFilter === "Hiring Surge"
        ? "bg-orange-500 text-white"
        : "bg-[#24304A]"
    }`}
  >
    Hiring
  </button>
 
  <button
    onClick={() => setSelectedFilter("Tech Change")}
    className={`px-4 py-2 rounded-xl ${
      selectedFilter === "Tech Change"
        ? "bg-orange-500 text-white"
        : "bg-[#24304A]"
    }`}
  >
    Tech Change
  </button>
 
</div>
 
 
{filteredCompanies.map((company, ) => (
  <div
    key={company._id}
    className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6 flex justify-between items-center"
  >
    {/* =====================================================
        COMPANY DETAILS
 
        Data comes from companies collection.
 
        Fields:
        - name
        - employees
        - signal
        - score
 
    ===================================================== */}
 
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-3">
 
        <h2 className="font-bold text-2xl text-white">
          {company.name}
        </h2>
 
        <span className="text-xs px-3 py-1 rounded-full border font-semibold bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
          {company.signal || ""}
        </span>
 
      </div>
 
      <p className="text-gray-400 text-sm mt-3">
        {company.employees
          ? `${company.employees} employees`
          : ""}
      </p>
    </div>
 
    {/* =====================================================
        INTENT SCORE
 
        Score is stored in companies collection.
 
    ===================================================== */}
 
    <div className="text-right ml-8">
 
      <div className="text-green-400 text-5xl font-bold">
        {company.score || ""}
      </div>
 
      <div className="text-gray-400 text-sm mb-4">
        Intent Score
      </div>
 
      <button className="bg-teal-600 hover:bg-teal-700 px-5 py-3 rounded-xl text-sm font-medium transition">
        + Add to Sequence
      </button>
 
    </div>
  </div>
))}
    </div>
  );
}
 