import { ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function ThumbsUpComponent() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 rounded-full 
        transition-colors duration-200 ${
          isClicked
            ? "text-green-500 hover:text-green-600"
            : "text-muted-foreground hover:text-foreground cursor-pointer"
        }`}
      onClick={() => !isClicked && setIsClicked(true)}
    >
      <ThumbsUp
        className={`h-4 w-4 ${isClicked ? "scale-110" : "scale-100"}`}
      />
      <span className="sr-only">Not helpful</span>
    </Button>
  );
}
