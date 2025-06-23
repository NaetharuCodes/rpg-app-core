import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { MarkdownViewer } from "@/components/MarkdownViewer/MarkdownViewer";
import type { Story, Chapter, Page } from "@/services/api";

const mockStory: Story = {
  id: 1,
  world_id: 1,
  title: "The Last Water",
  category: "Survival",
  excerpt: "In the endless dunes, every drop is life...",
  created_at: "2024-01-01",
  chapters: [
    {
      id: 1,
      story_id: 1,
      title: "Chapter 1: The Dying Well",
      order: 1,
      created_at: "2024-01-01",
      pages: [
        {
          id: 1,
          chapter_id: 1,
          order: 1,
          type: "title",
          content: "# The Last Water\n\n*A story of the Dustlands*",
          created_at: "2024-01-01",
        },
        {
          id: 2,
          chapter_id: 1,
          order: 2,
          type: "text",
          content:
            "The sun hammered down on cracked earth as Kira approached the well. Three days without water. Her lips were split, her tongue thick as leather.",
          created_at: "2024-01-01",
        },
        {
          id: 3,
          chapter_id: 1,
          order: 3,
          type: "text",
          content:
            "The rope descended into darkness. No splash. No sound. Just the whisper of wind across empty stone.",
          created_at: "2024-01-01",
        },
      ],
    },
  ],
};

export function StoryReaderPage() {
  const { worldId, storyId } = useParams<{
    worldId: string;
    storyId: string;
  }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [calculatedPages, setCalculatedPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setStory(mockStory);
    setTotalPages(mockStory.chapters.flatMap((c) => c.pages).length + 1); // +1 for back cover
    setIsLoading(false);
  }, [storyId]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPageNumber(pageNumber);
    }
  };

  const nextPage = () => goToPage(currentPageNumber + 1);
  const prevPage = () => goToPage(currentPageNumber - 1);

  // Get the page content for a specific page number
  const getPageContent = (pageNumber: number) => {
    if (!story) return null;

    // Page 1 is always the title page
    if (pageNumber === 1) {
      return story.chapters[0]?.pages.find((p) => p.type === "title") || null;
    }

    // Last page is back cover
    if (pageNumber === totalPages) {
      return {
        type: "title",
        content: "# The End\n\n*Thank you for reading*",
      } as Page;
    }

    // Content pages (skip title page, so pageNumber - 2)
    const allContentPages = story.chapters.flatMap((c) =>
      c.pages.filter((p) => p.type !== "title")
    );

    return allContentPages[pageNumber - 2] || null;
  };

  // Render page content based on type
  const renderPageContent = (page: Page | null) => {
    if (!page) return <div className="text-slate-400 italic">Blank page</div>;

    switch (page.type) {
      case "title":
        return (
          <MarkdownViewer content={page.content} className="text-center" />
        );
      case "text":
        return <MarkdownViewer content={page.content} />;
      case "image":
        return (
          <img
            src={page.content}
            alt="Story illustration"
            className="max-w-full h-auto"
          />
        );
      case "notes":
        return (
          <MarkdownViewer
            content={page.content}
            className="italic text-slate-600"
          />
        );
      default:
        return <div>{page.content}</div>;
    }
  };

  if (isLoading) {
    return <div>Loading story...</div>;
  }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={() => navigate(`/worlds/${worldId}/stories`)}
              >
                Back to Stories
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{story?.title}</h1>
                <p className="text-muted-foreground">Reading Mode</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-center">
          {/* Desktop: Two-page spread */}
          <div className="hidden lg:flex bg-card shadow-lg rounded-lg overflow-hidden w-full max-w-6xl border border-border">
            {/* Left page */}
            <div
              className="flex-1 h-[700px] p-8 border-r border-border relative cursor-pointer overflow-y-auto"
              onClick={prevPage}
            >
              <div className="h-full flex flex-col">
                {currentPageNumber > 1 && (
                  <div className="text-sm text-muted-foreground mb-4">
                    Page {currentPageNumber - 1}
                  </div>
                )}
                <div className="flex-1">
                  {currentPageNumber > 1
                    ? renderPageContent(getPageContent(currentPageNumber - 1))
                    : null}
                </div>
              </div>
            </div>

            {/* Right page */}
            <div
              className="flex-1 h-[700px] p-8 relative cursor-pointer overflow-y-auto"
              onClick={nextPage}
            >
              <div className="h-full flex flex-col">
                <div className="text-sm text-muted-foreground mb-4">
                  Page {currentPageNumber}
                </div>
                <div className="flex-1">
                  {renderPageContent(getPageContent(currentPageNumber))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile & Tablet: Single page */}
          <div className="lg:hidden bg-card shadow-lg rounded-lg w-full max-w-lg mx-auto border border-border">
            <div className="p-8 min-h-[600px] overflow-y-auto">
              <div className="text-sm text-muted-foreground mb-4">
                Page {currentPageNumber}
              </div>
              <div>{renderPageContent(getPageContent(currentPageNumber))}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
