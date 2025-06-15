const getResultColor = (num: number) => {
  const modifierValue = modifier?.value || 0;

  // Adjust thresholds based on modifier
  const failureThreshold = 2 - modifierValue; // normally 1-2
  const partialThreshold = 4 - modifierValue; // normally 3-4

  if (num <= failureThreshold) return "text-red-600 dark:text-red-400";
  if (num <= partialThreshold) return "text-yellow-600 dark:text-yellow-400";
  return "text-green-600 dark:text-green-400";
};

const getResultLabel = (num: number) => {
  const modifierValue = modifier?.value || 0;

  // Adjust thresholds based on modifier
  const failureThreshold = 2 - modifierValue; // normally 1-2
  const partialThreshold = 4 - modifierValue; // normally 3-4

  if (num <= failureThreshold) return "Failure";
  if (num <= partialThreshold) return "Partial Success";
  return "Success";
};
import React, { useState } from "react";
import { X, Dice6 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiceRoller({ isOpen, onClose }: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<{
    roll: number;
    interpretation: string;
    color: string;
    modifier?: { value: number; label: string };
  } | null>(null);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [modifier, setModifier] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const modifierOptions = [
    { value: 1, label: "Expertise (+1)" },
    { value: 1, label: "Favorable (+1)" },
    { value: -1, label: "Challenging (-1)" },
    { value: -2, label: "Extreme (-2)" },
  ];

  const getInterpretation = (roll: number, modifierValue: number) => {
    const failureThreshold = 2 - modifierValue;
    const partialThreshold = 4 - modifierValue;

    if (roll <= failureThreshold) {
      return {
        interpretation: "Failure",
        color: "text-red-600 dark:text-red-400",
      };
    }
    if (roll <= partialThreshold || modifierValue <= -2) {
      // With extreme conditions (-2 or worse), best you can do is partial success
      return {
        interpretation: "Partial Success",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    }
    return {
      interpretation: "Success",
      color: "text-green-600 dark:text-green-400",
    };
  };

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    setResult(null);

    // Simulate rolling animation for 1.5 seconds
    setTimeout(() => {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      const modifierValue = modifier?.value || 0;
      const interpretation = getInterpretation(diceRoll, modifierValue);

      setResult({
        roll: diceRoll,
        interpretation: interpretation.interpretation,
        color: interpretation.color,
        modifier: modifier,
      });
      setRollHistory((prev) => [diceRoll, ...prev.slice(0, 4)]); // Keep last 5 rolls
      setIsRolling(false);
      setModifier(null); // Reset modifier after roll
    }, 1500);
  };

  const getResultColor = (num: number) => {
    const modifierValue = modifier?.value || 0;

    // Adjust thresholds based on modifier
    const failureThreshold = 2 - modifierValue; // normally 1-2
    const partialThreshold = 4 - modifierValue; // normally 3-4

    if (num <= failureThreshold) return "text-red-600 dark:text-red-400";
    if (num <= partialThreshold) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getResultLabel = (num: number) => {
    const modifierValue = modifier?.value || 0;

    // Adjust thresholds based on modifier
    const failureThreshold = 2 - modifierValue; // normally 1-2
    const partialThreshold = 4 - modifierValue; // normally 3-4

    if (num <= failureThreshold) return "Failure";
    if (num <= partialThreshold) return "Partial Success";
    return "Success";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Dice6 className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">Roll D6</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modifier Selection */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            Roll Modifier
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setModifier(null)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors border",
                !modifier
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              No Modifier
            </button>
            {modifierOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setModifier(option)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors border",
                  modifier?.label === option.label
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Rolling Area */}
        <div className="p-8 text-center">
          {/* Dice Display */}
          <div className="mb-8">
            <div
              className={cn(
                "inline-flex items-center justify-center w-24 h-24 rounded-lg border-2 border-border bg-background transition-all duration-300",
                isRolling && "border-accent"
              )}
              style={{
                animation: isRolling ? "spin 1.5s linear" : "none",
                transform: isRolling ? "rotate(720deg)" : "rotate(0deg)",
              }}
            >
              {isRolling ? (
                <Dice6 className="h-10 w-10 text-accent animate-pulse" />
              ) : result ? (
                <span className={cn("text-4xl font-bold", result.color)}>
                  {result.roll}
                </span>
              ) : (
                <Dice6 className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Result Display - Fixed Height Container */}
          <div className="mb-6 h-24 flex flex-col justify-center">
            {result && !isRolling && (
              <>
                <div className={cn("text-2xl font-bold mb-2", result.color)}>
                  {result.interpretation}
                </div>
                <div className="text-sm text-muted-foreground">
                  Rolled: {result.roll}
                  {result.modifier && (
                    <span className="ml-1">
                      ({result.modifier.label.toLowerCase()})
                    </span>
                  )}
                </div>
              </>
            )}

            {isRolling && (
              <>
                <div className="text-lg font-medium text-accent mb-2">
                  Rolling...
                </div>
                <div className="text-sm text-muted-foreground">
                  {modifier
                    ? `Rolling with ${modifier.label.toLowerCase()}`
                    : "The dice are tumbling..."}
                </div>
              </>
            )}
          </div>

          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling}
            className={cn(
              "w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            <Dice6 className="mr-2 h-4 w-4" />
            {isRolling ? "Rolling..." : result ? "Roll Again" : "Roll D6"}
          </button>
        </div>

        {/* Roll History - Always Visible */}
        <div className="border-t border-border p-4">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            Recent Rolls
          </h3>
          <div className="flex gap-2">
            {rollHistory.length > 0
              ? rollHistory.map((roll, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-8 h-8 rounded border border-border bg-background flex items-center justify-center text-sm font-medium text-foreground",
                      index === 0 && "ring-2 ring-accent ring-opacity-50"
                    )}
                  >
                    {roll}
                  </div>
                ))
              : // Empty placeholder boxes
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded border border-border bg-muted/30 flex items-center justify-center text-sm font-medium text-muted-foreground"
                  >
                    -
                  </div>
                ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="text-xs text-muted-foreground space-y-1">
            {modifier ? (
              // Show adjusted thresholds when modifier is selected
              (() => {
                const modValue = modifier.value;
                const failThresh = Math.max(1, 2 - modValue);

                if (modValue <= -2) {
                  // Extreme conditions - no full success possible
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>1–{failThresh}:</span>
                        <span className="text-red-600 dark:text-red-400">
                          Failure
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{Math.min(6, failThresh + 1)}–6:</span>
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Partial Success
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>—:</span>
                        <span className="text-muted-foreground">
                          No Full Success
                        </span>
                      </div>
                    </>
                  );
                } else {
                  // Normal modifier ranges
                  const partialThresh = Math.min(6, 4 - modValue);

                  return (
                    <>
                      <div className="flex justify-between">
                        <span>1–{failThresh}:</span>
                        <span className="text-red-600 dark:text-red-400">
                          Failure
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {Math.max(1, failThresh + 1)}–{partialThresh}:
                        </span>
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Partial Success
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{Math.min(6, partialThresh + 1)}–6:</span>
                        <span className="text-green-600 dark:text-green-400">
                          Success
                        </span>
                      </div>
                    </>
                  );
                }
              })()
            ) : (
              // Show standard thresholds
              <>
                <div className="flex justify-between">
                  <span>1-2:</span>
                  <span className="text-red-600 dark:text-red-400">
                    Failure
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>3-4:</span>
                  <span className="text-yellow-600 dark:text-yellow-400">
                    Partial Success
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>5-6:</span>
                  <span className="text-green-600 dark:text-green-400">
                    Success
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
