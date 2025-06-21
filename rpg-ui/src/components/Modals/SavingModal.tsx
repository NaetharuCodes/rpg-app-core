import { useEffect } from "react";
import { Dice6 } from "lucide-react";

interface SavingModalProps {
  isOpen: boolean;
  isLoading: boolean;
  message?: string;
  onClose: () => void;
}

const SavingModal = ({
  isOpen,
  isLoading,
  message = "Saving...",
  onClose,
}: SavingModalProps) => {
  useEffect(() => {
    if (isOpen && !isLoading) {
      const timeout = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-8 text-center w-[200px]">
        <Dice6
          className={`h-10 w-10 mx-auto mb-3 ${
            isLoading
              ? "text-accent animate-spin animate-pulse"
              : "text-green-500"
          }`}
        />
        <p className="text-sm text-muted-foreground">
          {isLoading ? message : "Saved!"}
        </p>
      </div>
    </div>
  );
};

export default SavingModal;
