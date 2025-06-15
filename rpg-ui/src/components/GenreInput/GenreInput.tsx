// rpg-ui/src/components/GenreInput/GenreInput.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";

interface GenreInputProps {
  genres: string[];
  onGenresChange: (genres: string[]) => void;
  className?: string;
  suggestedGenres?: string[];
  maxGenres?: number;
  placeholder?: string;
}

const DEFAULT_SUGGESTED_GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Horror",
  "Mystery",
  "Adventure",
  "Urban",
  "Medieval",
  "Modern",
  "Post-Apocalyptic",
  "Steampunk",
];

export function GenreInput({
  genres,
  onGenresChange,
  className = "",
  suggestedGenres = DEFAULT_SUGGESTED_GENRES,
  maxGenres = 10,
  placeholder = "Add a genre...",
}: GenreInputProps) {
  const [newGenre, setNewGenre] = useState("");

  const handleAddGenre = (genre: string) => {
    const trimmedGenre = genre.trim();
    if (
      trimmedGenre &&
      !genres.includes(trimmedGenre) &&
      genres.length < maxGenres
    ) {
      onGenresChange([...genres, trimmedGenre]);
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    onGenresChange(genres.filter((genre) => genre !== genreToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGenre.trim()) {
      handleAddGenre(newGenre);
      setNewGenre("");
    }
  };

  const availableSuggestions = suggestedGenres.filter(
    (genre) => !genres.includes(genre)
  );

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-3">
        Genres
        {maxGenres && (
          <span className="text-muted-foreground ml-1">
            ({genres.length}/{maxGenres})
          </span>
        )}
      </label>

      {/* Current genres */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {genre}
              <button
                type="button"
                onClick={() => handleRemoveGenre(genre)}
                className="ml-1 hover:text-red-500 transition-colors"
                aria-label={`Remove ${genre} genre`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add new genre */}
      {genres.length < maxGenres && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder={placeholder}
              maxLength={20}
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!newGenre.trim()}
            >
              Add
            </Button>
          </form>

          {/* Suggested genres */}
          {availableSuggestions.length > 0 && (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                Suggested:
              </div>
              <div className="flex flex-wrap gap-1">
                {availableSuggestions.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleAddGenre(genre)}
                    className="text-xs px-2 py-1 border border-border rounded bg-muted hover:bg-accent transition-colors"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {genres.length >= maxGenres && (
        <div className="text-xs text-muted-foreground">
          Maximum number of genres reached
        </div>
      )}
    </div>
  );
}
