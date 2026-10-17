import { component, defineMarkdocConfig, nodes } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  nodes: {
    link: {
      ...nodes.link,
      render: component("./src/components/Link.astro"),
    },
    document: {
      ...nodes.document,
      attributes: {
        ...nodes.document.attributes,
        class: { type: String, default: "prose flow" },
      },
    },
  },
});
