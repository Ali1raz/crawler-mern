'use server';

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { SavedItem, ApiListResponse, ApiItemResponse } from "@/types/saved-item";
import type { ApiResponse } from "@/types/types";

export async function getSavedItems(): Promise<SavedItem[]> {
  try {
    const res = await api.get<ApiListResponse<SavedItem>>("/api/saved-items");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch saved items:", error);
    return [];
  }
}

export async function getSavedItem(id: string): Promise<SavedItem | null> {
  try {
    const res = await api.get<ApiItemResponse<SavedItem>>(`/api/saved-items/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch saved item:", error);
    return null;
  }
}

export async function retryScrapeAction(id: string): Promise<ApiResponse> {
  try {
    await api.post(`/api/saved-items/${id}/retry`, {});
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Retry failed",
    };
  }
}

export async function deleteItemAction(id: string): Promise<ApiResponse> {
  try {
    await api.delete(`/api/saved-items/${id}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}
