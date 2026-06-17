// import { Routes, Route } from "react-router-dom";

// import MainLayout from "../layouts/MainLayout";
// import ProtectedRoute from "../components/ProtectedRoute";

// import Login from "../pages/Login";
// import Signup from "../pages/Signup";

// import Dashboard from "../pages/Dashboard";
// import Campaigns from "../pages/Campaigns";
// import Pipeline from "../pages/Pipeline";
// import Outreach from "../pages/Outreach";
// import Agents from "../pages/Agents";
// import Signals from "../pages/Signals";
// import Analytics from "../pages/Analytics";
// import ICPConfig from "../pages/ICPConfig";
// import Settings from "../pages/Settings";

// export default function AppRoutes() {
//   return (
//     <Routes>

//       {/* Public Routes */}
//       <Route path="/" element={<Login />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />

//       {/* Protected Routes */}
//       <Route
//         element={
//           <ProtectedRoute>
//             <MainLayout />
//           </ProtectedRoute>
//         }
//       >

//         <Route
//           path="/dashboard"
//           element={<Dashboard />}
//         />

//         <Route
//           path="/campaigns"
//           element={<Campaigns />}
//         />

//         <Route
//           path="/pipeline"
//           element={<Pipeline />}
//         />

//         <Route
//           path="/outreach"
//           element={<Outreach />}
//         />

//         <Route
//           path="/agents"
//           element={<Agents />}
//         />

//         <Route
//           path="/signals"
//           element={<Signals />}
//         />

//         <Route
//           path="/analytics"
//           element={<Analytics />}
//         />

//         <Route
//           path="/icp"
//           element={<ICPConfig />}
//         />

//         <Route
//           path="/settings"
//           element={<Settings />}
//         />

//       </Route>

//     </Routes>
//   );
// }













import { Routes, Route } from "react-router-dom";
 
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
 
import Login from "../pages/Login";
import Signup from "../pages/Signup";
 
// NEW IMPORTS
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
 
import Dashboard from "../pages/Dashboard";
import Campaigns from "../pages/Campaigns";
import CampaignDetails from "../pages/CampaignDetails";
import Pipeline from "../pages/Pipeline";
import Outreach from "../pages/Outreach";
import Agents from "../pages/Agents";
import Signals from "../pages/Signals";
import Analytics from "../pages/Analytics";
import ICPConfig from "../pages/ICPConfig";
import Settings from "../pages/Settings";
 
export default function AppRoutes() {
  return (
    <Routes>
 
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
 
      {/* NEW ROUTES */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
 
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />
 
      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
 
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
 
        <Route
          path="/campaigns"
          element={<Campaigns />}
      />

        <Route
          path="/campaigns/:id"
          element={<CampaignDetails />}
      />

        <Route
          path="/pipeline"
          element={<Pipeline />}
      />
 
        <Route
          path="/outreach"
          element={<Outreach />}
        />
 
        <Route
          path="/agents"
          element={<Agents />}
        />
 
        <Route
          path="/signals"
          element={<Signals />}
        />
 
        <Route
          path="/analytics"
          element={<Analytics />}
        />
 
        <Route
          path="/icp"
          element={<ICPConfig />}
        />
 
        <Route
          path="/settings"
          element={<Settings />}
        />
 
      </Route>
 
    </Routes>
  );
}