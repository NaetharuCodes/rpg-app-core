import type { AssetPickerAsset } from "@/components/Modals/AssetPickerModal";

export const mockAssets: AssetPickerAsset[] = [
  {
    id: "sir-marcus-brightblade",
    name: "Sir Marcus Brightblade",
    type: "character",
    description: "A young knight seeking to prove his honor",
    imageUrl: "https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Knight",
  },
  {
    id: "captain-roderick",
    name: "Captain Roderick",
    type: "character",
    description: "Weathered fortress commander",
    imageUrl: "https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Captain",
  },
  {
    id: "void-general",
    name: "The Void General",
    type: "creature",
    description: "What King Aldric becomes when corrupted",
    imageUrl: "https://via.placeholder.com/300x400/DC2626/FFFFFF?text=Void",
  },
  {
    id: "fortress-valenhall",
    name: "Fortress Valenhall",
    type: "location",
    description: "Ancient stronghold with protective wards",
    imageUrl: "https://via.placeholder.com/300x400/059669/FFFFFF?text=Fortress",
  },
  {
    id: "ancient-sword",
    name: "Ancient Runeblade",
    type: "item",
    description: "A mystical weapon of great power",
    imageUrl: "https://via.placeholder.com/300x400/D97706/FFFFFF?text=Sword",
  },
];
