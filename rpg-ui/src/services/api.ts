const API_BASE = "http://localhost:8080";

export interface Asset {
  id: number;
  name: string;
  description: string;
  type: "character" | "creature" | "location" | "item";
  image_url: string;
  is_official: boolean;
  genres: string[];
  created_at: string;
}

interface ImageUploadResponse {
  image_id: string;
  filename: string;
  urls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

export const assetService = {
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/api/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return response.json();
  },

  async getAll(): Promise<Asset[]> {
    const response = await fetch(`${API_BASE}/assets`);
    if (!response.ok) throw new Error("Failed to fetch assets");
    return response.json();
  },

  async create(asset: Omit<Asset, "id" | "created_at">): Promise<Asset> {
    const response = await fetch(`${API_BASE}/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asset),
    });
    if (!response.ok) throw new Error("Failed to create asset");
    return response.json();
  },
};
