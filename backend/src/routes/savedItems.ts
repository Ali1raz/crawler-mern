import { Router, Response } from "express";
import { SavedItem } from "../models/savedItem.model";
import { AuthedRequest, requireAuth } from "../middleware/auth.middleware";
import { firecrawl } from "../lib/firecrawl";
import { ExtractSchemaType } from "../lib/schema";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const items = await SavedItem.find({ userId }).sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

router.get("/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const item = await SavedItem.findOne({ _id: id, userId });

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  return res.json({ success: true, data: item });
});

router.delete(
  "/:id",
  requireAuth,
  async (req: AuthedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deleted = await SavedItem.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json({ success: true, data: {} });
  },
);

router.post(
  "/:id/retry",
  requireAuth,
  async (req: AuthedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const item = await SavedItem.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.status !== "FAILED") {
      return res
        .status(400)
        .json({ error: "Only FAILED items can be retried" });
    }

    item.status = "PROCESSING";
    await item.save();

    try {
      const resData = await firecrawl.scrape(item.url, {
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

      const jsonData = resData.json as ExtractSchemaType;

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
        },
      );

      return res.json({ success: true, data: updated });
    } catch (error) {
      item.status = "FAILED";
      await item.save();

      return res.json({ success: false, error: "Scrape failed again" });
    }
  },
);

export default router;
