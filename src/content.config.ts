import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

// Collections hold one directory of entries per item; singletons hold a single
// index file, whose extension depends on whether the page has a Markdoc body.
const entries = (name: string) =>
  glob({ pattern: "**/*.mdoc", base: `./src/content/${name}` });
const singletonEntry = (name: string, extension = "{yaml,yml,json}") =>
  glob({ pattern: `index.${extension}`, base: `./src/content/${name}` });

const concerts = defineCollection({
  loader: entries("concerts"),
  schema: z.object({
    eventTitle: z.string(),
    date: z.coerce.date(),
    time: z.string().optional(),
    timeZone: z.string(),
  }),
});

// Shared by recordings, performances and podcasts. Optional URLs are empty
// when unset in Keystatic.
const optionalUrl = z.url().nullish();

const mediaItem = ({ image }: { image: () => z.ZodType }) => ({
  title: z.string(),
  publisherUrl: optionalUrl,
  releaseDate: z.coerce.date(),
  image: image(),
  imageAlt: z.string(),
});

const streamingLinks = {
  spotifyUrl: optionalUrl,
  appleMusicUrl: optionalUrl,
  youtubeMusicUrl: optionalUrl,
};

const recordings = defineCollection({
  loader: entries("recordings"),
  schema: ({ image }) =>
    z.object({ ...mediaItem({ image }), ...streamingLinks }),
});

const performances = defineCollection({
  loader: entries("performances"),
  schema: ({ image }) =>
    z.object({ ...mediaItem({ image }), youtubeUrl: optionalUrl }),
});

const podcasts = defineCollection({
  loader: entries("podcasts"),
  schema: ({ image }) =>
    z.object({ ...mediaItem({ image }), ...streamingLinks }),
});

const singletonPageSchema = z.object({
  pageTitle: z.string(),
  pageDescription: z.string(),
  eyebrow: z.string(),
  heading: z.string(),
});

// Hero photo fields from Keystatic. Alt text is required whenever an image is
// set, which Keystatic can't check on its own.
const heroImage = z
  .object({ image: z.string().nullish(), alt: z.string().nullish() })
  .nullish()
  .refine((hero) => !hero?.image || Boolean(hero.alt?.trim()), {
    message: "Alt text is required when a hero image is set",
    path: ["alt"],
  });

const heroFields = {
  photoCredit: z.string().optional(),
  heroImage,
};

const home = defineCollection({
  loader: singletonEntry("home"),
  schema: singletonPageSchema.extend({
    heroSummary: z.string(),
    ...heroFields,
  }),
});

const bio = defineCollection({
  loader: singletonEntry("bio", "mdoc"),
  schema: singletonPageSchema.extend({
    heroSummary: z.string(),
    ...heroFields,
  }),
});

const media = defineCollection({
  loader: singletonEntry("media"),
  schema: singletonPageSchema,
});

// Keystatic stores an optional group as { discriminant, value }; flatten it
// so the page only sees the value when the group is switched on.
const optionalGroup = <T extends z.ZodType>(group: T) =>
  z
    .object({ discriminant: z.boolean(), value: group.nullish() })
    .transform((field) =>
      field.discriminant ? (field.value ?? undefined) : undefined,
    )
    .optional();

const teaching = defineCollection({
  loader: singletonEntry("teaching", "mdoc"),
  schema: singletonPageSchema.extend({
    heroSummary: z.string().optional(),
    ...heroFields,
    cards: z
      .array(
        z.object({
          title: z.string(),
          // Inline Markdoc (bold, links), rendered in teaching.astro
          body: z.string(),
        }),
      )
      .max(3)
      .default([]),
    banner: optionalGroup(
      z.object({
        title: z.string(),
        body: z.string().optional(),
        cta: optionalGroup(
          z.object({
            label: z.string(),
            link: z.url(),
          }),
        ),
      }),
    ),
  }),
});

export const collections = {
  concerts,
  home,
  bio,
  media,
  teaching,
  recordings,
  performances,
  podcasts,
};
