const API_BASE = "http://localhost:8080";

// Existing Asset interface (keeping for reference)
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

// New Adventure-related interfaces
export interface Adventure {
  id: number;
  title: string;
  description: string;
  banner_image_url?: string;
  card_image_url?: string;
  genres: string[];
  is_official: boolean;
  age_rating: "For Everyone" | "Teen" | "Adult";
  user_id?: number;
  created_at: string;
  episodes?: Episode[];
  title_page?: any; // TODO: Define TitlePage interface
  epilogue?: any; // TODO: Define Epilogue interface
}

export interface TitlePage {
  id: number;
  adventure_id: number;
  title: string;
  subtitle: string;
  banner_image_url: string;
  introduction: string;
  background: string;
  prologue: string;
  created_at: string;
}

export interface Episode {
  id: number;
  adventure_id: number;
  order: number;
  title: string;
  description: string;
  created_at: string;
  scenes?: Scene[];
}

export interface Scene {
  id: number;
  episode_id: number;
  order: number;
  title: string;
  description: string;
  image_url?: string;
  prose?: string;
  gm_notes?: string;
  created_at: string;
}

export interface Epilogue {
  id: number;
  adventure_id: number;
  title: string;
  content: string;
  outcomes: EpilogueOutcome[];
  designer_notes: string;
  follow_up_hooks: FollowUpHook[];
  credits: {
    designer: string;
    system: string;
    version: string;
    year: string;
  };
  created_at: string;
}

export interface EpilogueOutcome {
  id: number;
  epilogue_id: number;
  title: string;
  description: string;
  details: string;
  order: number;
}

export interface FollowUpHook {
  id: number;
  epilogue_id: number;
  title: string;
  description: string;
  order: number;
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return response;
}

// Existing Asset service (keeping for reference)
export const assetService = {
  async getAll(): Promise<Asset[]> {
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

// Adventure service with nested episode and scene management
export const adventureService = {
  // Adventure CRUD operations
  async getAll(): Promise<Adventure[]> {
    const response = await authenticatedFetch(`${API_BASE}/adventures`);
    return response.json();
  },

  async getById(id: number): Promise<Adventure> {
    const response = await authenticatedFetch(`${API_BASE}/adventures/${id}`);
    return response.json();
  },

  async create(
    adventure: Omit<Adventure, "id" | "created_at" | "user_id">
  ): Promise<Adventure> {
    const response = await authenticatedFetch(`${API_BASE}/adventures`, {
      method: "POST",
      body: JSON.stringify(adventure),
    });
    return response.json();
  },

  async update(
    id: number,
    adventure: Partial<Omit<Adventure, "id" | "created_at" | "user_id">>
  ): Promise<Adventure> {
    const response = await authenticatedFetch(`${API_BASE}/adventures/${id}`, {
      method: "PATCH",
      body: JSON.stringify(adventure),
    });
    return response.json();
  },

  async delete(id: number): Promise<void> {
    await authenticatedFetch(`${API_BASE}/adventures/${id}`, {
      method: "DELETE",
    });
  },

  // Episode management
  episodes: {
    async getAll(adventureId: number): Promise<Episode[]> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes`
      );
      return response.json();
    },

    async create(
      adventureId: number,
      episode: Omit<Episode, "id" | "adventure_id" | "order" | "created_at">
    ): Promise<Episode> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes`,
        {
          method: "POST",
          body: JSON.stringify(episode),
        }
      );
      return response.json();
    },

    async update(
      adventureId: number,
      episodeId: number,
      episode: Partial<
        Omit<Episode, "id" | "adventure_id" | "order" | "created_at">
      >
    ): Promise<Episode> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes/${episodeId}`,
        {
          method: "PATCH",
          body: JSON.stringify(episode),
        }
      );
      return response.json();
    },

    async delete(adventureId: number, episodeId: number): Promise<void> {
      await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes/${episodeId}`,
        {
          method: "DELETE",
        }
      );
    },
  },

  // Scene management
  scenes: {
    async getAll(adventureId: number, episodeId: number): Promise<Scene[]> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes/${episodeId}/scenes`
      );
      return response.json();
    },

    async create(
      adventureId: number,
      episodeId: number,
      scene: Omit<Scene, "id" | "episode_id" | "order" | "created_at">
    ): Promise<Scene> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes/${episodeId}/scenes`,
        {
          method: "POST",
          body: JSON.stringify(scene),
        }
      );
      return response.json();
    },

    async update(
      adventureId: number,
      episodeId: number,
      sceneId: number,
      scene: Partial<Omit<Scene, "id" | "episode_id" | "order" | "created_at">>
    ): Promise<Scene> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes/${episodeId}/scenes/${sceneId}`,
        {
          method: "PATCH",
          body: JSON.stringify(scene),
        }
      );
      return response.json();
    },

    async delete(
      adventureId: number,
      episodeId: number,
      sceneId: number
    ): Promise<void> {
      await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/episodes/${episodeId}/scenes/${sceneId}`,
        {
          method: "DELETE",
        }
      );
    },
  },

  // Title Page management
  titlePage: {
    async get(adventureId: number): Promise<TitlePage> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/title-page`
      );
      return response.json();
    },

    async create(
      adventureId: number,
      titlePage: Omit<TitlePage, "id" | "adventure_id" | "created_at">
    ): Promise<TitlePage> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/title-page`,
        {
          method: "POST",
          body: JSON.stringify(titlePage),
        }
      );
      return response.json();
    },

    async update(
      adventureId: number,
      titlePage: Partial<Omit<TitlePage, "id" | "adventure_id" | "created_at">>
    ): Promise<TitlePage> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/title-page`,
        {
          method: "PATCH",
          body: JSON.stringify(titlePage),
        }
      );
      return response.json();
    },

    async delete(adventureId: number): Promise<void> {
      await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/title-page`,
        {
          method: "DELETE",
        }
      );
    },
  },
  epilogue: {
    async get(adventureId: number): Promise<Epilogue> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/epilogue`
      );
      return response.json();
    },

    async create(
      adventureId: number,
      epilogue: Omit<Epilogue, "id" | "adventure_id" | "created_at">
    ): Promise<Epilogue> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/epilogue`,
        {
          method: "POST",
          body: JSON.stringify(epilogue),
        }
      );
      return response.json();
    },

    async update(
      adventureId: number,
      epilogue: any // TODO: Create proper interface
    ): Promise<any> {
      const response = await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/epilogue`,
        {
          method: "PATCH",
          body: JSON.stringify(epilogue),
        }
      );
      return response.json();
    },

    async delete(adventureId: number): Promise<void> {
      await authenticatedFetch(
        `${API_BASE}/adventures/${adventureId}/epilogue`,
        {
          method: "DELETE",
        }
      );
    },
  },
};
