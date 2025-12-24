import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    section: z.enum(['Basics', 'Everyday Life', 'Past Tenses', 'Advanced']),
    order: z.number(),
    description: z.string(),
    vocabulary: z
      .array(
        z.object({
          spanish: z.string().optional(),
          ipa: z.string().optional(),
          english: z.string().optional(),
          notes: z.string().optional(),
        }) 
      )
      .optional(),
    grammarTopics: z.array(z.string()).optional(),
  }),
});

export const collections = { lessons };
