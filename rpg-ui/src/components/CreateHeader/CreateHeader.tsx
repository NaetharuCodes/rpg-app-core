import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "../Button/Button";

interface CreateHeaderProps {
  isEditing: boolean;
  handleSave: () => void;
  togglePreview?: (toggle: boolean) => void;
  navigateBack: () => void;
}

const CreateHeader = ({
  isEditing,
  handleSave,
  togglePreview,
  navigateBack,
}: CreateHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" leftIcon={ArrowLeft} onClick={navigateBack}>
              <span className="hidden lg:inline">Back to Overview</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                {isEditing ? "Edit Adventure" : "Create New Adventure"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-1 lg:line-clamp-none">
                {isEditing
                  ? "Modify your adventure structure and content"
                  : "Build your custom RPG adventure step by step"}
              </p>
            </div>
          </div>
          <div className="flex gap-3 self-end sm:self-auto">
            {togglePreview && (
              <Button
                variant="secondary"
                leftIcon={Eye}
                onClick={() => togglePreview(true)}
              >
                preview
              </Button>
            )}
            <Button onClick={handleSave} leftIcon={Save}>
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHeader;
