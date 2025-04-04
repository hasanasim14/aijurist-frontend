"use client";

import { useState, useRef } from "react";
import { Wand2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhanceButtonProps {
  onEnhance?: (text: string) => Promise<string>;
  getInputText?: () => string;
  setInputText?: (text: string) => void;
}

export function EnhanceButton({
  onEnhance = async (text) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL2 + "/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to enhance text");
      const data = await response.json();
      return data.enhancedText;
    } catch (error) {
      console.error("Error enhancing text:", error);
      return text;
    }
  },
  getInputText = () => "",
  setInputText = () => {},
}: EnhanceButtonProps) {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const originalTextRef = useRef<string>("");
  const isMobile = useIsMobile();

  const handleEnhance = async () => {
    const currentText = getInputText();

    if (!currentText.trim()) return;

    originalTextRef.current = currentText;
    setIsLoading(true);

    try {
      const enhancedText = await onEnhance(currentText);
      const newText = "This is a new text";
      setInputText(newText);
      setIsEnhanced(true);
    } catch (error) {
      console.error("Error enhancing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    setInputText(originalTextRef.current);
    setIsEnhanced(false);
  };

  const text = getInputText();

  return (
    <Button
      variant="outline"
      onClick={isEnhanced ? handleUndo : handleEnhance}
      disabled={isLoading || text.trim() === ""}
      className="rounded-full hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
      title={isEnhanced ? "Undo" : "Enhance"}
      size={isMobile ? "icon" : "default"}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      ) : isEnhanced ? (
        <>
          <Undo2 size={18} className="h-4 w-4" />
          {!isMobile && <span>Undo</span>}
        </>
      ) : (
        <>
          <Wand2 size={18} className="h-4 w-4" />
          {!isMobile && <span>Enhance</span>}
        </>
      )}
    </Button>
  );
}
