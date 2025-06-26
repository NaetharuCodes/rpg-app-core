export const ageRatingColors = {
  "For Everyone": "green",
  Teen: "yellow",
  Adult: "destructive",
} as const;

export const AGE_RATINGS = ["For Everyone", "Teen", "Adult"] as const;

export type AgeRating = (typeof AGE_RATINGS)[number];
