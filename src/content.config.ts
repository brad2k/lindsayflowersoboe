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
  }),
});

const media = defineCollection({
  loader: glob({
    pattern: "index.{yaml,yml,json}",
    base: "./src/content/media",
  }),
  schema: singletonPageSchema,
});

const teaching = defineCollection({
  loader: glob({
    pattern: "index.{yaml,yml,json}",
    base: "./src/content/teaching",
  }),
  schema: singletonPageSchema,
});

export const collections = { concerts, home, bio, media, teaching };
