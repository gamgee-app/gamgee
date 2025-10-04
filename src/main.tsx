import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GamgeeApp } from "./components/gamgee-app/gamgee-app.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GamgeeApp />
  </StrictMode>,
);
