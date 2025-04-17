import { ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function ThumbsDownComponent() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`
        h-8 w-8 rounded-full 
        transition-colors duration-200
        ${
          isClicked
            ? "text-red-500 hover:text-red-600"
            : "text-muted-foreground hover:text-foreground cursor-pointer"
        }
      `}
      onClick={() => !isClicked && setIsClicked(true)}
    >
      <ThumbsDown
        className={`h-4 w-4 ${isClicked ? "scale-110" : "scale-100"}`}
      />
      <span className="sr-only">Not helpful</span>
    </Button>
  );
}
