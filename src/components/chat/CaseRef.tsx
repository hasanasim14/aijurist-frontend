"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

// Case Details Interface
interface CaseDetails {
  judgement: string;
  court: string;
  case_no: string;
  judge: string;
  parties: string;
  citation: string;
  year: string;
  highlightVectors?: string[];
  displayText?: string[];
}

export function CaseRef({ lookupData }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [caseDetails, setCaseDetails] = useState<CaseDetails>();
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (dialogRef.current) {
        const shouldShow = dialogRef.current.scrollTop > 100;

        if (!shouldShow && showBackToTop) {
          if (timeoutId) clearTimeout(timeoutId);

          timeoutId = setTimeout(() => {
            setShowBackToTop(false);
          }, 300);
        } else if (shouldShow) {
          setShowBackToTop(true);
        }
      }
    };

    const currentDialog = dialogRef.current;
    if (currentDialog) {
      currentDialog.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (currentDialog) {
        currentDialog.removeEventListener("scroll", handleScroll);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isDialogOpen, showBackToTop]);

  const handleViewDetails = async (caseItem: any) => {
    setIsLoading(true);
    setIsDialogOpen(true);

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL2 + "/describe_t4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vector_ids: caseItem.vectorIDs,
            flag: false,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch case details");
      }

      const data = await response.json();
      if (data && data.data) {
        const firstKey = Object.keys(data.data)[0];
        if (firstKey && data.data[firstKey]) {
          // Format the case details properly
          setCaseDetails({
            judgement: data.data[firstKey].Judgement || "",
            court: data.data[firstKey].court || "",
            case_no: data.data[firstKey].case_no || "",
            judge: data.data[firstKey].judge || "",
            parties: data.data[firstKey].parties || "",
            citation: data.data[firstKey].citation || "",
            year: data.data[firstKey].year || "",
            highlightVectors: data.data[firstKey].highlightVectors || [],
            displayText: data.data[firstKey].displayText || [],
          });
        }
      }
      console.log("Formatted Case Details:", caseDetails);
    } catch (error) {
      console.error("Error fetching case details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    if (dialogRef.current) {
      dialogRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const highlightJudgment = (judgment: string, highlightVectors?: string[]) => {
    if (!highlightVectors || highlightVectors.length === 0) {
      return { __html: judgment };
    }

    let highlightedJudgment = judgment;

    highlightVectors.forEach((vector) => {
      if (vector && highlightedJudgment.includes(vector)) {
        highlightedJudgment = highlightedJudgment.replace(
          vector,
          `<mark class="bg-yellow-200 px-1 rounded font-bold italic">${vector}</mark>`
        );
      }
    });

    return { __html: highlightedJudgment };
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            className="bg-[#27272a] text-white hover:bg-[#212124]-800 cursor-pointer px-2"
          >
            Case Ref <ArrowRight className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="max-w-[500px] sm:max-w-[75%] w-full"
        >
          <ScrollArea className="flex-1 px-6 overflow-y-auto">
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Response</h2>
                <p className="text-sm text-muted-foreground">
                  {lookupData.content}
                </p>
              </div>

              <div className="space-y-2">
                <Accordion type="single" collapsible className="w-full">
                  {Object.keys(lookupData.lookup).map((key) => {
                    const caseItem = lookupData.lookup[key];
                    return (
                      <AccordionItem key={key} value={key}>
                        <AccordionTrigger className="text-sm font-medium cursor-pointer">
                          {caseItem.Title} ({caseItem.id})
                        </AccordionTrigger>
                        <AccordionContent>
                          <Card className="border-0 shadow-none p-0">
                            <CardContent className="p-1 space-y-1 1/2">
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-s font-medium text-muted-foreground">
                                  Court
                                </span>
                                <span className="text-xs">
                                  {caseItem.Court}
                                </span>
                              </div>
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-s font-medium text-muted-foreground">
                                  Parties:
                                </span>
                                <span className="text-xs">
                                  {caseItem.Parties}
                                </span>
                              </div>
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Judge:
                                </span>
                                <span className="text-xs">
                                  {caseItem.Judge}
                                </span>
                              </div>
                              <div className="flex justify-end mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs flex items-center gap-1 cursor-pointer"
                                  onClick={() => handleViewDetails(caseItem)}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  View Case
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          </ScrollArea>

          <SheetFooter>
            <div className="flex w-full items-center justify-between border-t border-border py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  is this helpful?
                </span>
                {/* Thumbs Up */}
                <button className="preferences">
                  <ThumbsUp className="h-5 w-5" />
                  <span className="sr-only">Helpful</span>
                </button>
                {/* Thumbs Down*/}
                <button className="preferences">
                  <ThumbsDown className="h-5 w-5" />
                  <span className="sr-only">Not helpful</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Regenerate Button */}
                <button className="caseref-actionbtn">
                  <RefreshCcw className="h-5 w-5" />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>
                {/* Download Button */}
                <button className="caseref-actionbtn">
                  <Download className="h-5 w-5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                {/* Copy Button */}
                <button className="caseref-actionbtn">
                  <Copy className="h-5 w-5" />
                  <span className="hidden sm:inline">Copy</span>
                </button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* More Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[95%] h-[95%] p-0 gap-0 overflow-hidden">
          {/* Empty dialog title to remove the error */}
          <DialogTitle>{}</DialogTitle>
          {/* Close button */}
          <button
            onClick={() => setIsDialogOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div ref={dialogRef} className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : caseDetails ? (
              <div className="space-y-6">
                {/* Logo and header */}
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col items-center">
                    <img
                      src="sld-logo.png"
                      alt="SLD Logo"
                      className="h-25 mb-2"
                    />
                    <span className="text-sm text-muted-foreground text-center">
                      Content & Citation by SLD
                    </span>
                  </div>
                </div>

                {/* Citations */}
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">
                    Cited as: {caseDetails.citation || "N/A"}
                  </p>
                  <p className="text-xl font-semibold">
                    {caseDetails.court || "N/A"}
                  </p>
                  <p>{caseDetails.case_no || "N/A"}</p>
                  <p className="text-lg uppercase">
                    {caseDetails.judge || "N/A"}
                  </p>
                  <p className="text-lg uppercase">
                    {caseDetails.parties || "N/A"}
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-300 my-4" />

                {/* Judgment */}
                <div className="space-y-4">
                  <div
                    className="text-medium"
                    dangerouslySetInnerHTML={highlightJudgment(
                      caseDetails.judgement || "No summary available",
                      caseDetails.highlightVectors
                    )}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No case details available
              </div>
            )}
          </div>

          {/* Back to Top Button */}
          <div
            className={`fixed bottom-6 right-6 z-10 transition-all duration-300 ease-in-out ${
              showBackToTop
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10 pointer-events-none"
            }`}
          >
            {!isLoading && caseDetails && (
              <Button
                className="rounded-full w-auto h-8 px-3 py-1 shadow-md bg-black hover:bg-gray-800 text-white text-xs flex items-center gap-1 cursor-pointer"
                onClick={scrollToTop}
                variant="secondary"
              >
                <span>Back to Top</span>
                <ChevronUp className="h-3 w-3" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
