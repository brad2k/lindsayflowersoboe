import markdoc from "@astrojs/markdoc";
import node from "@astrojs/node";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.lindsayflowersoboe.com/",
  output: "static",
  fonts: [
    {
      name: "Cormorant Garamond",
      cssVariable: "--font-Garamond",
      provider: fontProviders.google(),
      weights: [400, 600],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["serif"],
    },
    {
      name: "Work Sans",
      cssVariable: "--font-WorkSans",
      provider: fontProviders.google(),
      weights: [400, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],

  adapter: node({ mode: "standalone" }), // probably don't need
  integrations: [react(), markdoc(), keystatic(), sitemap()],
});
