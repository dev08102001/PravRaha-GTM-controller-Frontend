import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
 
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css";
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Always treat cached data as stale so external changes (e.g. rows
      // deleted directly in the database) show up as soon as the user
      // returns to the tab or navigates back to a page.
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      retry: 2, // Retry failed requests twice before throwing an error
    },
  },
});
 
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0F172A",
            color: "#F8FAFC",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 10px 30px rgba(2, 6, 23, 0.25)",
            borderRadius: "12px",
            padding: "12px 14px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#F8FAFC",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#F8FAFC",
            },
          },
        }}
      />
    </BrowserRouter>
  </QueryClientProvider>
);