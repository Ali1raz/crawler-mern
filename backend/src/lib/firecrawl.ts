import { Firecrawl } from 'firecrawl';
import "dotenv/config";

export const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});
