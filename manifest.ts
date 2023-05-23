import { ManifestOptions } from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
  name: "Open Video Share",
  short_name: "OVS",
  description: "Share your video stream with peer-to-peer (no servers between).",
  start_url: "/open-video-share/",
  display: "standalone",
  background_color: "#f8f9fa",
  theme_color: "#228be6",
  lang: "en",
  scope: "/",
  icons: [
    {
      src: "/open-video-share/icons/manifest-icon-192.maskable.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "/open-video-share/icons/manifest-icon-512.maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};

export default manifest;
