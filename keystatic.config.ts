import { config, fields, collection, singleton } from '@keystatic/core';

const singletonPageSchema = {
  pageTitle: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
  pageDescription: fields.text({
    label: 'Page Description',
    validation: { isRequired: true },
    multiline: true,
  }),
  eyebrow: fields.text({ label: 'Eyebrow', validation: { isRequired: true } }),
  heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
};

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    home: singleton({
      label: 'Home Page',
      path: 'src/content/home/',
      schema: singletonPageSchema,
    }),
    bio: singleton({
      label: 'Bio Page',
      path: 'src/content/bio/',
      schema: singletonPageSchema,
    }),
    media: singleton({
      label: 'Media Page',
      path: 'src/content/media/',
      schema: singletonPageSchema,
    }),
    teaching: singleton({
      label: 'Teaching Page',
      path: 'src/content/teaching/',
      schema: singletonPageSchema,
    }),
  },
  collections: {
    concerts: collection({
      label: 'Concerts',
      slugField: 'eventTitle',
      path: 'src/content/concerts/*',
      format: { contentField: 'details' },
      schema: {
        eventTitle: fields.slug({ name: { label: 'Event Title' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        time: fields.text({
          label: 'Time',
          description: 'e.g. 7:30 PM',
        }),
        timeZone: fields.text({
          label: 'Time Zone',
          description: 'IANA time zone name, e.g. America/New_York',
          validation: { isRequired: true },
        }),
        details: fields.markdoc({ label: 'Details' }),
      },
    }),
  },
});
