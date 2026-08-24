import z from "zod";

export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
});

export type ExtractSchemaType = z.infer<typeof extractSchema>;
