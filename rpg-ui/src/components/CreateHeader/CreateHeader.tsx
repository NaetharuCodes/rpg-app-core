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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" leftIcon={ArrowLeft} onClick={navigateBack}>
              Back to Overview
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? "Edit Adventure" : "Create New Adventure"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditing
                  ? "Modify your adventure structure and content"
                  : "Build your custom RPG adventure step by step"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
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
