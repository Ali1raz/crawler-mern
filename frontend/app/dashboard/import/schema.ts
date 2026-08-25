import { z } from 'zod';

export const singleUrlImportSchema = z.object({
  url: z.url('Please enter a valid URL'),
});

export type SingleUrlImportSchemaType = z.infer<typeof singleUrlImportSchema>;
