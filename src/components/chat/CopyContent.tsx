"use client";

import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { useChatContext } from "@/context/ChatContext";

export function CopyContent({ apiResponseIndex }: any) {
  const { selectedChatId } = useChatContext();

  const transformForCopy = (data: any): string => {
    if (!data?.data || !Array.isArray(data.data)) {
      return JSON.stringify(data);
    }

    return data.data
      .map((item: any) => {
        const fullTitle = item.Title?.trim() || "";

        const cleanContent = (item.content || [])
          .map((text: string) => {
            return (
              text
                ?.replace(/\r/g, "")
                ?.replace(/&amp;/g, "&")
                ?.replace(/^\s+|\s+$/g, "")
                ?.replace(/\s{2,}/g, " ")
                ?.replace(/\n/g, " ") || ""
            );
          })
          .join("\n");

        return `\t${fullTitle}\n${cleanContent}`;
      })
      .join("\n\n");
  };

  const handleCopy = async () => {
    const token = sessionStorage.getItem("authToken");

    try {
      const response = await fetch(
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

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const apiData = await response.json();
      const transformedData = transformForCopy(apiData);
      await navigator.clipboard.writeText(transformedData);
    } catch (error) {
      console.error("Error during copy operation:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 h-8 cursor-pointer"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4" />
      <span className="hidden sm:inline">Copy</span>
    </Button>
  );
}
