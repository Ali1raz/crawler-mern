import express, { Application, Request, Response, NextFunction } from "express";
import type { AuthedRequest } from "./middleware/auth.middleware";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { clerkMiddleware, clerkClient, getAuth } from "@clerk/express";
import { requireAuth } from "./middleware/auth.middleware";
import webhookRoutes from "./routes/webhooks";
import connectDB from "./lib/mongoose";
import { User } from "./models/user.model";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is required");
}

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.get("/health", async (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/protected", requireAuth, async (req: AuthedRequest, res: Response) => {
  res.json({ user: req.user });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  console.log("---------");
  res.status(500).json({ error: "Internal Server Error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
