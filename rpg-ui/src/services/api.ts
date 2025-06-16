const API_BASE = "http://localhost:8080";

export interface Asset {
  id: number;
  name: string;
  description: string;
  type: "character" | "creature" | "location" | "item";
  image_url: string;
  is_official: boolean;
  genres: string[];
  user_id?: number;
  created_at: string;
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Helper function to make authenticated requests
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired, remove it
      localStorage.removeItem("auth_token");
      throw new Error("Authentication required");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export const assetService = {
  async getAll(): Promise<Asset[]> {
    // This endpoint supports optional auth - will return different content based on auth status
    const response = await authenticatedFetch(`${API_BASE}/assets`);
    return response.json();
  },

  async getById(id: number): Promise<Asset> {
    const response = await authenticatedFetch(`${API_BASE}/assets/${id}`);
    return response.json();
  },

  async create(
    asset: Omit<Asset, "id" | "created_at" | "user_id" | "is_official">
  ): Promise<Asset> {
    const response = await authenticatedFetch(`${API_BASE}/assets`, {
      method: "POST",
      body: JSON.stringify(asset),
    });
    return response.json();
  },

  async update(
    id: number,
    asset: Partial<Omit<Asset, "id" | "created_at" | "user_id" | "is_official">>
  ): Promise<Asset> {
    const response = await authenticatedFetch(`${API_BASE}/assets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(asset),
    });
    return response.json();
  },

  async delete(id: number): Promise<void> {
    await authenticatedFetch(`${API_BASE}/assets/${id}`, {
      method: "DELETE",
    });
  },
};

// Image upload service
export interface ImageUploadResponse {
  image_id: string;
  filename: string;
  urls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

export const imageService = {
  async uploadImage(
    file: File,
    metadata?: { alt?: string; caption?: string }
  ): Promise<ImageUploadResponse> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication required for image upload");
    }

    const formData = new FormData();
    formData.append("file", file);

    if (metadata?.alt) {
      formData.append("alt", metadata.alt);
    }
    if (metadata?.caption) {
      formData.append("caption", metadata.caption);
    }

    const response = await fetch(`${API_BASE}/api/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Authentication required");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    return response.json();
  },
};
