// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/assets/styles/index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="top-left" />}
    </QueryClientProvider>
    <Toaster />
  </BrowserRouter>
  // </React.StrictMode>
);
