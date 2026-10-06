import { defineMarkdocConfig, nodes } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  nodes: {
    document: {
      ...nodes.document,
      attributes: {
        ...nodes.document.attributes,
        class: { type: String, default: "prose flow" },
      },
    },
  },
});
