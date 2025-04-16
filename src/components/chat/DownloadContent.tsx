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

  const cleanHtmlContent = (html: string): string => {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>|<p>/gi, "\n")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s{2,}/g, " ");
  };

  const formatContentForPDF = (
    propResponse: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiData: any
  ): { title: string; content: string }[] => {
    const result = [];

    if (propResponse) {
      result.push({
        title: "Response from The AI Jurist",
        content: cleanHtmlContent(propResponse),
      });
    }

    if (apiData?.data && Array.isArray(apiData.data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiData.data.forEach((item: any) => {
        const title = item.Title?.trim() || "Legal Document Excerpt";

        let content = Array.isArray(item.content)
          ? item.content.map(cleanHtmlContent).join("\n\n")
          : cleanHtmlContent(item.content || "");

        content = content
          .replace(/===== Page \d+ =====/g, "")
          .replace(/#{1,6}\s*/g, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/^\s*-\s*/gm, "• ")
          .replace(/(\d+\.)\s*/g, "$1 ")
          .replace(/\s{3,}/g, "  ");

        content = content.replace(
          /(\d{4} (?:SLD|PLD|SCMR|YLR|CLC|PLC) \d+)/g,
          "\n$1\n"
        );

        result.push({
          title,
          content: content.trim(),
        });
      });
    }

    return result;
  };

  const generatePDF = (data: { title: string; content: string }[]) => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      compress: true,
    });

    doc.setProperties({
      title: "Legal Document Analysis",
      subject: "Legal Research",
      author: "The AI Jurist",
    });

    const imgData = "/logo.png";
    const imgWidth = 50;
    const imgHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(imgData, "PNG", imgX, 15, imgWidth, imgHeight);

    // Spacing below the Image
    let yPosition = 40;

    doc.setFont("helvetica");
    doc.setTextColor(0, 0, 0);

    data.forEach((item, index) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(item.title, 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const lines = doc.splitTextToSize(item.content, 170);

      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 25;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });

      // Add space between sections
      if (index < data.length - 1) {
        yPosition += 15;
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
