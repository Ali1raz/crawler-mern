"use server";

import { api } from "@/lib/api-server";
import { revalidatePath } from "next/cache";
import { singleUrlImportSchema } from "./schema";
import { ApiResponse } from "@/types/types";

export async function scrapeUrlAction(url: string): Promise<ApiResponse> {
  const result = singleUrlImportSchema.safeParse({ url });

  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
    };
  }

  const { url: parsedUrl } = result.data;
  console.log(url);

  try {
    await api.post("/api/scrape", { url: parsedUrl });
    revalidatePath("/dashboard"); // refresh dashboard data on next load
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape URL",
    };
  }
}
