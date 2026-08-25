import { Router, Request, Response } from "express";
import { firecrawl } from "../lib/firecrawl";
import { SavedItem } from "../models/savedItem.model";
import { AuthedRequest, requireAuth } from "../middleware/auth.middleware";
import { singleUrlImportSchema } from "../lib/schema";

const router = Router();

router.post("/", requireAuth, async (req: AuthedRequest, res: Response) => {
  const result = singleUrlImportSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.message });
  }

  const { url } = result.data;
  console.log("scraping url", url)

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const item = await SavedItem.create({
    url,
    userId,
    status: "PROCESSING",
  });

  try {
    const resData = await firecrawl.scrape(url, {
      formats: [
        "markdown",
        {
          type: "json",
          prompt: "please extract the author and publishedAt timestamp",
        },
      ],
      onlyMainContent: true,
      location: { country: "US", languages: ["en"] },
      proxy: "auto",
    });

    const jsonData = resData.json as { author?: string; publishedAt?: string };

    let publishedAt: Date | null = null;

    if (jsonData.publishedAt) {
      const parsed = new Date(jsonData.publishedAt);

      if (!isNaN(parsed.getTime())) {
        publishedAt = parsed;
      }
    }

    const updated = await SavedItem.updateOne(
      { _id: item._id },
      {
        status: "COMPLETED",
        title: resData.metadata?.title,
        content: resData.markdown,
        ogImage: resData.metadata?.ogImage,
        author: jsonData.author,
        publishedAt,
      }
    );

    return res.json({ success: true, data: updated });
  } catch (error) {
    await SavedItem.updateOne(
      { _id: item._id },
      { status: "FAILED" }
    );

    const failedItems = await SavedItem.find({
      userId: (req as any).session.user.id,
      status: "FAILED",
    });

    return res.json({ success: false, data: failedItems });
  }
});

export default router;
