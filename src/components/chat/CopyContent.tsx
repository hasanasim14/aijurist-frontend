"use client";

import { useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { Button } from "../ui/button";
import { Copy, Check } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CopyContent({ apiResponseIndex, response }: any) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChatId } = useChatContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformForCopy = (apiData: any): string => {
    let combinedText = response || "";

    if (apiData?.data && Array.isArray(apiData.data)) {
      const apiContent = apiData.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => {
          const fullTitle = item.Title?.trim() || "";

          const cleanContent = (item.content || [])
            .map((text: string) => {
              return (
                text
                  ?.replace(/\r/g, "")
                  ?.replace(/&amp;/g, "&")
                  ?.replace(/<br\s*\/?>/gi, "\n")
                  ?.replace(/^\s+|\s+$/g, "")
                  ?.replace(/\s{2,}/g, " ")
                  ?.replace(/\n/g, " ") || ""
              );
            })
            .join("\n");

          return `\t${fullTitle}\n${cleanContent}`;
        })
        .join("\n\n");

      if (combinedText && apiContent) {
        combinedText += "\n\n\n";
      }

      combinedText += apiContent;
    }

    return combinedText;
  };

  const handleCopy = async () => {
    const token = sessionStorage.getItem("authToken");

    try {
      setIsLoading(true);
      const apiResponse = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/describe_t5",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chat_id: selectedChatId,
            qid: apiResponseIndex,
          }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();
      const combinedText = transformForCopy(apiData);

      await navigator.clipboard.writeText(combinedText);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error during copy operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 h-8 cursor-pointer"
      onClick={handleCopy}
      disabled={isLoading || isCopied}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy"}</span>
    </Button>
  );
}
