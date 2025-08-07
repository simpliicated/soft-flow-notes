import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedFeedbackProps {
  show: boolean;
  message: string;
  emoji?: string;
  onComplete?: () => void;
  duration?: number;
}

export const AnimatedFeedback = ({ 
  show, 
  message, 
  emoji = "✨", 
  onComplete, 
  duration = 2000 
}: AnimatedFeedbackProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(onComplete, 300); // Wait for fade out
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
        "bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-strong",
        "transition-all duration-300 ease-out",
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      )}
    >
      <div className="text-center space-y-2">
        <div className="text-4xl animate-bounce">{emoji}</div>
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
};