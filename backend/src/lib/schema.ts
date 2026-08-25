import z from "zod";

export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
});

export type ExtractSchemaType = z.infer<typeof extractSchema>;

export const singleUrlImportSchema = z.object({
  url: z.url("Please enter a valid URL"),
});

export type SingleUrlImportSchemaType = z.infer<typeof singleUrlImportSchema>;
