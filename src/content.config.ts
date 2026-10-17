// @ts-ignore
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const concerts = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/concerts" }),
  schema: z.object({
    eventTitle: z.string(),
    date: z.coerce.date(),
    time: z.string().optional(),
    timeZone: z.string(),
  }),
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

const home = defineCollection({
  loader: glob({
    pattern: "index.{yaml,yml,json}",
    base: "./src/content/home",
  }),
  schema: z.object({
    pageTitle: z.string(),
    pageDescription: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    heroSummary: z.string(),
    photoCredit: z.string().optional(),
    heroImage,
  }),
});

const bio = defineCollection({
  loader: glob({ pattern: "index.mdoc", base: "./src/content/bio" }),
  schema: z.object({
    pageTitle: z.string(),
    pageDescription: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    heroSummary: z.string(),
    photoCredit: z.string().optional(),
    heroImage,
  }),
});

const media = defineCollection({
  loader: glob({
    pattern: "index.{yaml,yml,json}",
    base: "./src/content/media",
  }),
  schema: singletonPageSchema,
});

// Keystatic stores an optional group as { discriminant, value }; flatten it
// so the page only sees the value when the group is switched on.
const optionalGroup = <T extends z.z.ZodType>(group: T) =>
  z
    .object({ discriminant: z.boolean(), value: group.nullish() })
    .transform((field) =>
      field.discriminant ? (field.value ?? undefined) : undefined,
    )
    .optional();

const teaching = defineCollection({
  loader: glob({ pattern: "index.mdoc", base: "./src/content/teaching" }),
  schema: singletonPageSchema.extend({
    heroSummary: z.string().optional(),
    photoCredit: z.string().optional(),
    heroImage,
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

export const collections = { concerts, home, bio, media, teaching };
