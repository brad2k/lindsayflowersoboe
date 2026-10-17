import markdoc from "@astrojs/markdoc";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.lindsayflowersoboe.com/",
  output: "static",
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
  fonts: [
    {
      name: "Cormorant Garamond",
      cssVariable: "--font-Garamond",
      provider: fontProviders.google(),
      weights: [400],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["serif"],
    },
    {
      name: "Work Sans",
      cssVariable: "--font-WorkSans",
      provider: fontProviders.google(),
      weights: [400, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],

  adapter: netlify(), // Keystatic's admin and GitHub OAuth routes run on demand as Netlify functions; pages stay prerendered
  integrations: [react(), markdoc(), keystatic(), sitemap()],
});
