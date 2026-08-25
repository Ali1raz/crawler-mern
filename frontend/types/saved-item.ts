export interface SavedItem {
  _id: string;
  url: string;
  userId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  title?: string;
  content?: string;
  ogImage?: string;
  author?: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}
