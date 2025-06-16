import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { AssetCard } from "@/components/AssetCard/AssetCard";
import type { Asset } from "@/services/api";

interface AssetCreationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export function AssetCreationSuccessModal({
  isOpen,
  onClose,
  asset,
}: AssetCreationSuccessModalProps) {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <h2 className="text-xl font-semibold">Asset Created!</h2>
              <p className="text-sm text-muted-foreground">
                Your asset has been added to your gallery
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Asset Card Preview */}
        <div className="p-6">
          <AssetCard asset={asset}>
            {/* Empty children - no action buttons needed in success modal */}
          </AssetCard>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button variant="primary" onClick={onClose} className="w-full">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
