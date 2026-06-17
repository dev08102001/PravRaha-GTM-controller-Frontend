import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
 
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css";
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      refetchOnWindowFocus: false, // Prevents refetching when switching browser tabs
      retry: 2, // Retry failed requests twice before throwing an error
    },
  },
});
 
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </QueryClientProvider>
);