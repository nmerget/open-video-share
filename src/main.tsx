import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "./i18n";
import { Notifications } from "@mantine/notifications";
import { registerSW } from "virtual:pwa-register";
import { t } from "i18next";

// add this to prompt for a refresh
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm(t("pwa-ask-update") || "Update available. Reload?")) {
      updateSW(true);
    }
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Notifications position="top-center" />
    <App />
  </MantineProvider>
);
