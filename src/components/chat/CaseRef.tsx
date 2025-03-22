"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { drawerData2 } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUp, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// Dummy data with appropriate content

export default function CaseReferences() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (dialogRef.current) {
        setShowBackToTop(dialogRef.current.scrollTop > 100);
      }
    };

    const currentDialog = dialogRef.current;
    if (currentDialog) {
      currentDialog.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (currentDialog) {
        currentDialog.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isDialogOpen, dialogRef.current]);

  const handleViewDetails = async (caseItem: any) => {
    setSelectedCase(caseItem);
    setIsLoading(true);
    setIsDialogOpen(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/cases/${caseItem.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch case details");
      }
      const data = await response.json();
      setCaseDetails(data);
    } catch (error) {
      console.error("Error fetching case details:", error);
      // For demo purposes, create some mock detailed data
      setCaseDetails({
        id: caseItem.id,
        title: caseItem.Title,
        parties: caseItem.Parties,
        court: caseItem.Court,
        judge: caseItem.Judge,
        summary:
          "This is a detailed summary of the case that would be fetched from the API.",
        fullText:
          "The full text of the case judgment would appear here with all the legal details and reasoning provided by the court.",
        citations: ["Citation 1", "Citation 2", "Citation 3"],
        relatedCases: ["Related Case 1", "Related Case 2"],
        dateDecided: "2023-05-15",
      });
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

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">View Case References</Button>
        </DrawerTrigger>
        {/* Ensuring proper width */}
        <DrawerContent className="rounded-tl-lg rounded-bl-lg w-full max-w-lg h-full">
          <div className="mx-auto w-full p-6 flex flex-col h-full">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-xl font-bold">
                Legal References
              </DrawerTitle>
            </DrawerHeader>

            {/* Apply max height to ensure scrolling */}
            <ScrollArea className="flex-1 px-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-6 mt-4">
                {/* Content */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Query</h2>
                  <p className="text-sm text-muted-foreground">
                    {drawerData2.data.user_query}
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Response</h2>
                  <p className="text-sm text-muted-foreground">
                    {drawerData2.data.llm_response}
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Referenced Cases</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {drawerData2.data.lookup.map((caseItem) => (
                      <AccordionItem key={caseItem.id} value={caseItem.id}>
                        <AccordionTrigger className="text-sm font-medium">
                          {caseItem.Title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <Card className="border-0 shadow-none">
                            <CardContent className="p-3 space-y-2">
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Parties:
                                </span>
                                <span className="text-xs">
                                  {caseItem.Parties}
                                </span>
                              </div>
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Court:
                                </span>
                                <span className="text-xs">
                                  {caseItem.Court}
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
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Case ID:
                                </span>
                                <span className="text-xs">{caseItem.id}</span>
                              </div>
                              {/* View More Details */}
                              <div className="flex justify-end mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs flex items-center gap-1"
                                  onClick={() => handleViewDetails(caseItem)}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
      {/* View More Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90%] h-[90%] max-w-[90%] max-h-[90%] p-6 rounded-lg overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedCase?.Title}</DialogTitle>
            <DialogDescription>{selectedCase?.Parties}</DialogDescription>
          </DialogHeader>

          <div ref={dialogRef} className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : caseDetails ? (
              <div className="space-y-4 py-4">
                {/* Citation */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Cited As:</span>
                  <span>{caseDetails.citation}</span>
                </div>
                {/* Court Name */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Court:</span>
                  <span>{caseDetails.court}</span>
                </div>
                {/* Case Number */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Case Number:</span>
                  <span>{caseDetails.case_no}</span>
                </div>
                {/* Judge */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Judge:</span>
                  <span>{caseDetails.judge}</span>
                </div>
                {/* Parties */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Parties:</span>
                  <span>{caseDetails.parties}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Summary</h3>
                  <p className="text-sm">{caseDetails.summary}</p>
                  This is a detailed summary of the case that would be fetched
                  from the API. The case involves complex legal issues related
                  to software licensing and copyright infringement in the
                  technology sector. This is a detailed summary of the case that
                  would be fetched from the API. The case involves complex legal
                  issues related to software licensing and copyright
                  infringement in the technology sector. This is a detailed
                  summary of the case that would be fetched from the API. The
                  case involves complex legal issues related to software
                  licensing and copyright infringement in the technology sector.
                  This is a detailed summary of the case that would be fetched
                  from the API. The case involves complex legal issues related
                  to software licensing and copyright infringement in the
                  technology sector. This is a detailed summary of the case that
                  would be fetched from the API. The case involves complex legal
                  issues related to software licensing and copyright
                  infringement in the technology sector. This is a detailed
                  summary of the case that would be fetched from the API. The
                  case involves complex legal issues related to software
                  licensing and copyright infringement in the technology sector.
                  This is a detailed summary of the case that would be fetched
                  from the API. The case involves complex legal issues related
                  to software licensing and copyright infringement in the
                  technology sector. This is a detailed summary of the case that
                  would be fetched from the API. The case involves complex legal
                  issues related to software licensing and copyright
                  infringement in the technology sector.
                </div>
              </div>
            ) : null}
          </div>

          {/* Floating Back to Top Button */}
          {showBackToTop && !isLoading && caseDetails && (
            <Button
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 rounded-full w-10 h-10 p-0 shadow-md z-10"
              onClick={scrollToTop}
              variant="secondary"
            >
              <ChevronUp className="h-5 w-5" />
              <span className="sr-only">Back to top</span>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
