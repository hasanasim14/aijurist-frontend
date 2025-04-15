// "use client";

// import { Copy } from "lucide-react";
// import { Button } from "../ui/button";
// import { useChatContext } from "@/context/ChatContext";
// import { toCopyData } from "@/lib/utils";

// interface CaseData {
//   caseID?: string;
//   caseTitle?: string;
//   summary?: string;
// }

// export function CopyContent({ apiResponseIndex }: any) {
//   const { selectedChatId } = useChatContext();

//   const handleCopy1 = async () => {
//     const token = sessionStorage.getItem("authToken");
//     // try {
//     //   const requestBody = {
//     //     chat_id: selectedChatId,
//     //     qid: apiResponseIndex,
//     //   };

//     //   console.log("request Body", requestBody);

//     //   const response = await fetch(
//     //     process.env.NEXT_PUBLIC_BASE_URL + "/describe_t5",
//     //     {
//     //       method: "POST",
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //         Authorization: `Bearer ${token}`,
//     //       },
//     //       body: JSON.stringify({
//     //         chat_id: selectedChatId,
//     //         qid: apiResponseIndex,
//     //       }),
//     //     }
//     //   );

//     //   const data = await response.json();
//     //   console.log("data", data);

//     // } catch (error) {
//     //   console.error("Error", error);
//     // }

//     await navigator.clipboard.writeText(JSON.stringify(toCopyData));
//   };

//   const transformForCopy = (data: any): string => {
//     try {
//       // If the data is already a string, try to parse it as JSON
//       const content = typeof data === "string" ? data : JSON.stringify(data);
//       const parsedData = JSON.parse(content) as CaseData[];

//       if (Array.isArray(parsedData) && parsedData.length > 0) {
//         return parsedData
//           .map((caseData) => {
//             if (!caseData.summary) return "";

//             // Apply the same transformation as in MarkDownComponent
//             const markdownContent = caseData.summary
//               .replace(/^### Summary of the Case:.*?\n\n/, "")
//               .trim();

//             return [
//               caseData.caseTitle ? `**${caseData.caseTitle}**` : "",
//               markdownContent,
//             ]
//               .filter(Boolean)
//               .join("\n\n");
//           })
//           .join("\n\n---\n\n");
//       }
//       return content;
//     } catch (error) {
//       // If not JSON, return as-is (similar to the MarkDownComponent fallback)
//       return typeof data === "string" ? data : JSON.stringify(data);
//     }
//   };

//   const handleCopy = async () => {
//     try {
//       // Transform the data using the same logic as MarkDownComponent
//       const transformedData = transformForCopy(toCopyData);

//       // Copy the transformed data
//       await navigator.clipboard.writeText(transformedData);

//       console.log("Transformed data copied to clipboard!");
//       // Consider adding a toast notification here
//     } catch (err) {
//       console.error("Failed to copy: ", err);
//     }
//   };

//   return (
//     <Button
//       variant="ghost"
//       size="sm"
//       className="gap-1.5 h-8 cursor-pointer"
//       onClick={handleCopy}
//     >
//       <Copy className="h-4 w-4" />
//       <span className="hidden sm:inline">Copy</span>
//     </Button>
//   );
// }

"use client";

import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { useChatContext } from "@/context/ChatContext";
import { toCopyData } from "@/lib/utils";

export function CopyContent({ apiResponseIndex }: any) {
  const { selectedChatId } = useChatContext();

  const transformForCopy = (data: any): string => {
    try {
      // If the data is already a string, try to parse it as JSON
      const content = typeof data === "string" ? data : JSON.stringify(data);
      const parsedData = JSON.parse(content) as CaseData[];

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        return parsedData
          .map((caseData) => {
            if (!caseData.summary) return "";

            // Apply the same transformation as in MarkDownComponent
            const markdownContent = caseData.summary
              .replace(/^### Summary of the Case:.*?\n\n/, "")
              .trim();

            return [
              caseData.caseTitle ? `**${caseData.caseTitle}**` : "",
              markdownContent,
            ]
              .filter(Boolean)
              .join("\n\n");
          })
          .join("\n\n---\n\n");
      }
      return content;
    } catch (error) {
      // If not JSON, return as-is (similar to the MarkDownComponent fallback)
      return typeof data === "string" ? data : JSON.stringify(data);
    }
  };

  const handleCopy = async () => {
    try {
      // Transform the data using the same logic as MarkDownComponent
      const transformedData = transformForCopy(toCopyData);

      // Copy the transformed data
      await navigator.clipboard.writeText(transformedData);

      console.log("Transformed data copied to clipboard!");
      // Consider adding a toast notification here
    } catch (err) {
      console.error("Failed to copy: ", err);
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

// Define the same interface used in MarkDownComponent
interface CaseData {
  caseID?: string;
  caseTitle?: string;
  summary?: string;
}
