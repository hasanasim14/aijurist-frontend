"use client";

import { Download } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DownloadContent({ apiResponseIndex, response }: any) {
  const { selectedChatId } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

  const formatContentForPDF = (
    propResponse: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    apiData: any
  ): { title: string; content: string }[] => {
    const result = [];

    // Add prop response as the first item
    if (propResponse) {
      result.push({
        title: "Response from The AI Jurist",
        content: propResponse
          .replace(/\r/g, "")
          .replace(/&amp;/g, "&")
          .replace(/(<br\s*\/?>\s*)+/gi, "\n")
          .replace(/^\s+|\s+$/g, "")
          .replace(/\s{2,}/g, " "),
      });
    }

    // Add API response data
    if (apiData?.data && Array.isArray(apiData.data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiData.data.forEach((item: any) => {
        const title = item.Title?.trim() || "Untitled";
        const content = (item.content || [])
          .map((text: string) =>
            text
              ?.replace(/\r/g, "")
              ?.replace(/&amp;/g, "&")
              ?.replace(/(<br\s*\/?>\s*)+/gi, "\n")
              ?.replace(/^\s+|\s+$/g, "")
              ?.replace(/\s{2,}/g, " ")
          )
          .join("\n");

        result.push({ title, content });
      });
    }

    return result;
  };

  const generatePDF = (data: { title: string; content: string }[]) => {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: "Legal Document",
      subject: "Response Query",
      author: "The AI Jurist",
    });

    // Add image at the top (centered)
    // Replace with your actual image path or base64 string
    const imgData = "/logo.png"; // or use a base64 string
    const imgWidth = 50; // adjust as needed
    const imgHeight = 10; // adjust as needed

    // Calculate center position
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgX = (pageWidth - imgWidth) / 2;

    // Add image with some top margin
    doc.addImage(imgData, "PNG", imgX, 15, imgWidth, imgHeight);

    // Set initial yPosition below the image with more spacing
    let yPosition = 15 + imgHeight + 15; // image top + image height + spacing

    data.forEach((item, index) => {
      // Add title with increased spacing
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(item.title, 15, yPosition);
      yPosition += 12; // Increased from 10

      // Add content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      // Split content into lines that fit the page width
      const lines = doc.splitTextToSize(item.content, 180);

      // Check if content will fit before adding (with bottom margin)
      const neededSpace = lines.length * 7 + 15;
      if (yPosition + neededSpace > 270) {
        doc.addPage();
        yPosition = 25; // Reset with top margin
      }

      doc.text(lines, 15, yPosition);

      // Calculate new position with more spacing between sections
      yPosition += lines.length * 7 + 20; // Increased from 15

      // Add new page if needed (with more bottom margin)
      if (yPosition > 270 && index < data.length - 1) {
        doc.addPage();
        yPosition = 25; // Reset with top margin
      }
    });

    return doc;
  };
  const handleDownload = async () => {
    const token = sessionStorage.getItem("authToken");
    setIsLoading(true);

    try {
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
      const formattedData = formatContentForPDF(response, apiData);

      if (formattedData.length > 0) {
        const pdf = generatePDF(formattedData);
        pdf.save("legal-document.pdf");
      }
    } catch (error) {
      console.error("Error during download operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 h-8 cursor-pointer"
      onClick={handleDownload}
      disabled={isLoading}
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">
        {isLoading ? "Generating..." : "Download"}
      </span>
    </Button>
  );
}
