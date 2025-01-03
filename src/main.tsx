import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Web3Provider } from "./Web3Provider.tsx";
import { SessionProvider } from "./context/sessionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </SessionProvider>
  </StrictMode>,
);
