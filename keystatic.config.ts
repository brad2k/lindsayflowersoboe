import { config, fields, collection, singleton } from "@keystatic/core";

const teachingCard = fields.object(
  {
    title: fields.text({ label: "Title", validation: { isRequired: true } }),
    body: fields.markdoc.inline({ label: "Body" }),
  },
  { label: "Card" },
);

const teachingCta = fields.conditional(
  fields.checkbox({ label: "Show banner", defaultValue: false }),
  {
    false: fields.empty(),
    true: fields.object({
      title: fields.text({ label: "Title", validation: { isRequired: true } }),
      body: fields.text({ label: "Body", multiline: true }),
      cta: fields.conditional(
        fields.checkbox({ label: "Show button", defaultValue: false }),
        {
          false: fields.empty(),
          true: fields.object({
            label: fields.text({
              label: "Button label",
              validation: { isRequired: true },
            }),
            link: fields.text({
              label: "Button link",
              validation: { isRequired: true },
            }),
          }),
        },
      ),
    }),
  },
);

// Hero photo. The page still imports its image directly, so these fields are
// stored ahead of the image moving into Keystatic. Alt text is required when
// an image is set; that rule is enforced in src/content.config.ts.
const heroImage = fields.object(
  {
    image: fields.image({
      label: "Image",
      directory: "src/images/heroes",
      publicPath: "../../images/heroes/",
    }),
    alt: fields.text({
      label: "Alt text",
      description: "Describe the photo. Required when an image is set.",
    }),
  },
  { label: "Hero image" },
);

const singletonPageSchema = {
  pageTitle: fields.text({
    label: "Page Title",
    validation: { isRequired: true },
  }),
  pageDescription: fields.text({
    label: "Page Description",
    validation: { isRequired: true },
    multiline: true,
  }),
  eyebrow: fields.text({ label: "Eyebrow", validation: { isRequired: true } }),
  heading: fields.text({ label: "Heading", validation: { isRequired: true } }),
};

export default config({
  storage: {
    kind: "local",
  },
  singletons: {
    home: singleton({
      label: "Home Page",
      path: "src/content/home/",
      schema: {
        pageTitle: fields.text({
          label: "Page Title",
          validation: { isRequired: true },
        }),
        pageDescription: fields.text({
          label: "Page Description",
          validation: { isRequired: true },
        }),
        eyebrow: fields.text({
          label: "Eyebrow",
          validation: { isRequired: true },
        }),
        heading: fields.text({
          label: "Heading",
          validation: { isRequired: true },
        }),
        heroSummary: fields.text({
          label: "Hero summary",
          validation: { isRequired: true },
          multiline: true,
        }),
        photoCredit: fields.text({
          label: "Photo credit",
          description: "Leave blank to hide the photo caption.",
        }),
        heroImage,
      },
    }),
    bio: singleton({
      label: "Bio Page",
      path: "src/content/bio/",
      format: { contentField: "bio" },
      schema: {
        pageTitle: fields.text({
          label: "Page Title",
          validation: { isRequired: true },
        }),
        pageDescription: fields.text({
          label: "Page Description",
          validation: { isRequired: true },
        }),
        eyebrow: fields.text({
          label: "Eyebrow",
          validation: { isRequired: true },
        }),
        heading: fields.text({
          label: "Heading",
          validation: { isRequired: true },
        }),
        heroSummary: fields.text({
          label: "Hero summary",
          validation: { isRequired: true },
          multiline: true,
        }),
        photoCredit: fields.text({
          label: "Photo credit",
          description: "Leave blank to hide the photo caption.",
        }),
        heroImage,
        bio: fields.markdoc({
          label: "Biography",
        }),
      },
    }),
    media: singleton({
      label: "Media Page",
      path: "src/content/media/",
      schema: singletonPageSchema,
    }),
    teaching: singleton({
      label: "Teaching Page",
      path: "src/content/teaching/",
      format: { contentField: "teaching" },
      schema: {
        pageTitle: fields.text({
          label: "Page Title",
          validation: { isRequired: true },
        }),
        pageDescription: fields.text({
          label: "Page Description",
          validation: { isRequired: true },
        }),
        eyebrow: fields.text({
          label: "Eyebrow",
          validation: { isRequired: true },
        }),
        heading: fields.text({
          label: "Heading",
          validation: { isRequired: true },
        }),
        heroSummary: fields.text({
          label: "Hero summary",
          multiline: true,
        }),
        photoCredit: fields.text({
          label: "Photo credit",
          description: "Leave blank to hide the photo caption.",
        }),
        heroImage,
        cards: fields.array(teachingCard, {
          label: "Cards",
          itemLabel: (props) => props.fields.title.value,
          validation: { length: { max: 3 } },
        }),
        banner: teachingCta,
        teaching: fields.markdoc({
          label: "Teaching",
        }),
      },
    }),
  },
  collections: {
    concerts: collection({
      label: "Concerts",
      slugField: "eventTitle",
      path: "src/content/concerts/*",
      format: { contentField: "details" },
      schema: {
        eventTitle: fields.slug({ name: { label: "Event Title" } }),
        date: fields.date({ label: "Date", validation: { isRequired: true } }),
        time: fields.text({
          label: "Time",
          description: "e.g. 7:30 PM",
        }),
        timeZone: fields.text({
          label: "Time Zone",
          description: "IANA time zone name, e.g. America/New_York",
          validation: { isRequired: true },
        }),
        details: fields.markdoc({ label: "Details" }),
      },
    }),
  },
});
