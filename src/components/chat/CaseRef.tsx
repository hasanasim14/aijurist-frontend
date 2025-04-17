"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ChevronUp,
  ExternalLink,
  Eye,
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
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { CopyContent } from "./CopyContent";
import { DownloadContent } from "./DownloadContent";
import ThumbsUpComponent from "./ThumbsUp";
import ThumbsDownComponent from "./ThumbsDown";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CaseRef({ lookupData, apiResponseIndex }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [caseDetails, setCaseDetails] = useState<CaseDetails>();
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset showBackToTop when dialog closes
    if (!isDialogOpen) {
      setShowBackToTop(false);
      return;
    }

    const currentDialog = dialogRef.current;
    let scrollCheckInterval: NodeJS.Timeout;

    // Define handleScroll first
    const handleScroll = () => {
      if (currentDialog) {
        const shouldShow = currentDialog.scrollTop > 100;
        setShowBackToTop(shouldShow);
      }
    };

    // Store handler in variable for cleanup
    const scrollHandler = handleScroll;

    const setupScrollListener = () => {
      if (currentDialog) {
        currentDialog.addEventListener("scroll", scrollHandler);
        handleScroll();
        scrollCheckInterval = setInterval(handleScroll);

        setTimeout(() => {
          clearInterval(scrollCheckInterval);
        }, 5000);
      }
    };

    // let setupTimeout: NodeJS.Timeout;
    // setupTimeout = setTimeout(setupScrollListener, 300);
    const setupTimeout: NodeJS.Timeout = setTimeout(setupScrollListener, 300);

    return () => {
      clearTimeout(setupTimeout);
      clearInterval(scrollCheckInterval);

      if (currentDialog) {
        currentDialog.removeEventListener("scroll", scrollHandler);
      }
    };
  }, [isDialogOpen]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewDetails = async (caseItem: any) => {
    setIsLoading(true);
    setIsDialogOpen(true);
    setCaseDetails(undefined);

    setTimeout(async () => {
      const token = sessionStorage.getItem("authToken");
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/describe_t4",
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
      } catch (error) {
        console.error("Error fetching case details:", error);
      } finally {
        setIsLoading(false);
      }
    }, 100);
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
            className="bg-transparent hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer"
          >
            Case Ref <ArrowRight className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="max-w-[500px] sm:max-w-[75%] w-full flex flex-col overflow-hidden"
        >
          <SheetTitle className="sr-only">Case Reference</SheetTitle>
          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Case References
            </h2>
          </div>

          <div className="flex-1 px-6 overflow-y-auto">
            <div className="space-y-6 mt-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Response
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{lookupData.content}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Accordion type="single" collapsible className="w-full">
                  {Object.keys(lookupData.lookup).map((key) => {
                    const caseItem = lookupData.lookup[key];
                    return (
                      <AccordionItem key={key} value={key}>
                        <AccordionTrigger className="text-sm font-medium cursor-pointer hover:no-underline w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate flex-1">
                              {caseItem.Title} ({caseItem.id})
                            </span>
                            <div
                              className="h-6 w-6 p-0 cursor-pointer flex items-center justify-center rounded-md hover:bg-accent ml-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(caseItem);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Case</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Card className="border-0 shadow-none p-0">
                            <CardContent className="p-1 space-y-1">
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
                                <span className="text-s font-medium text-muted-foreground">
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
          </div>

          <SheetFooter className="px-6 py-4 border-t">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Is this helpful?
                </span>
                {/* Thumbs Up */}
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full cursor-pointer"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="sr-only">Helpful</span>
                </Button> */}
                <ThumbsUpComponent />
                {/* Thumbs Down */}
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full cursor-pointer"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="sr-only">Not helpful</span>
                </Button> */}
                <ThumbsDownComponent />
              </div>

              <div className="flex items-center gap-2">
                {/* Regenerate */}
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 h-8 cursor-pointer"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Regenerate</span>
                </Button> */}

                {/* Download */}
                <DownloadContent
                  apiResponseIndex={apiResponseIndex}
                  response={lookupData.content}
                />

                {/* Copy Button*/}
                <CopyContent
                  apiResponseIndex={apiResponseIndex}
                  response={lookupData.content}
                />
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* More Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[95%] h-[95%] p-0 gap-0 overflow-hidden">
          <DialogTitle className="sr-only">Case Details</DialogTitle>
          {/* Close button */}
          <div
            onClick={() => setIsDialogOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </div>

          <div
            ref={dialogRef}
            className="flex-1 overflow-y-auto p-6 select-none"
          >
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : caseDetails ? (
              <div className="space-y-6">
                <div className="flex justify-start">
                  <div className="flex flex-col items-center">
                    <Image
                      src="/sld-logo.png"
                      alt="SLD Logo"
                      className="h-25 mb-2"
                      width={100}
                      height={100}
                    />
                    <span className="text-sm text-muted-foreground text-center">
                      Content & Citation by SLD
                    </span>
                  </div>
                </div>

                {/* Citations */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center my-6">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={350}
                      height={350}
                      className="h-auto"
                    />
                  </div>

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
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
              showBackToTop
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10 pointer-events-none"
            }`}
          >
            {caseDetails && (
              <Button
                className="rounded-full w-auto h-10 px-4 py-2 shadow-lg bg-black hover:bg-gray-800 text-white text-sm flex items-center gap-2 cursor-pointer"
                onClick={scrollToTop}
                variant="secondary"
              >
                <span>Back to Top</span>
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
