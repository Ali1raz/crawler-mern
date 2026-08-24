import { Router, raw, Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import type { WebhookEvent } from "@clerk/express/webhooks";

const router = Router();

router.post(
  "/",
  raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    let evt: WebhookEvent | undefined;
    try {
      evt = await verifyWebhook(req);
    } catch (err) {
      console.error("Webhook verification failed:", err);
      res.status(400).json({ error: "Webhook verification failed" });
      return;
    }

    try {
      switch (evt.type) {
        case "user.created":
        case "user.updated": {
          const { id, email_addresses, first_name, last_name } = evt.data;
          const email = email_addresses[0]?.email_address;

          if (!email) {
            console.warn(`No email on Clerk user ${id}, skipping sync`);
            break;
          }

          const name =
            [first_name, last_name].filter(Boolean).join(" ").trim() || null;

          // upsert to db
          break;
        }

        case "user.deleted": {
          const { id } = evt.data;
          if (!id) break;
          // delete
          break;
        }

        default:
          console.log(`Unhandled webhook event type: ${evt.type}`);
      }
    } catch (err) {
      console.error(`Error handling ${evt.type}:`, err);
      res.status(500).json({ error: "Webhook handler failed" });
      return;
    }

    res.status(200).json({ received: true });
  },
);

export default router;
