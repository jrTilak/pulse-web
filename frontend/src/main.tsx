// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.css";
import { Toaster } from "./components/ui/toaster.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context.tsx";
import { GlobalContextProvider } from "./contexts/global-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <GlobalContextProvider>
        <App />
        <Toaster />
      </GlobalContextProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
