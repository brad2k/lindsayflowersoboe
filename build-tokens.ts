import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";
import { logVerbosityLevels } from "style-dictionary/enums";

import path from "node:path";
import type { TransformedToken } from "style-dictionary/types";

// Figma & Token Studio are exporting more than I need; filter it to just what I want
const INCLUDED_COLLECTIONS = ["Palette", "Tokens"];

const fromIncludedCollection = (token: TransformedToken) => {
  const file = token.filePath ?? "";
  if (!file.endsWith(".json")) return true; // hand-written .ts tokens always pass
  const collection = path.basename(path.dirname(file));
  return INCLUDED_COLLECTIONS.includes(collection);
};

register(StyleDictionary);

const sd = new StyleDictionary({
  usesDtcg: true,
  source: ["src/tokens/**/*.ts", "src/tokens/figma/**/*.json"],
  preprocessors: ["tokens-studio"],
  platforms: {
    css: {
      transforms: [
        ...StyleDictionary.hooks.transformGroups["tokens-studio"].filter(
          (t) => !t.startsWith("name/"),
        ),
        "name/kebab",
      ],
      files: [
        {
          destination: "src/styles/figma-tokens.css",
          format: "css/variables",
          filter: fromIncludedCollection,
        },
      ],
    },
  },
  log: {
    verbosity: logVerbosityLevels.verbose,
  },
});

await sd.buildAllPlatforms();
