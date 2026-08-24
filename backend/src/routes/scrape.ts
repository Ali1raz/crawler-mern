import { Router, Request, Response } from "express";
import { firecrawl } from "../lib/firecrawl";
import { SavedItem } from "../models/savedItem.model";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const userId = (req as any).session.user.id;

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