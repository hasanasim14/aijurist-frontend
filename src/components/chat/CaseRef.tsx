import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
// import { drawerData } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  ChevronRight,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CaseRef({ lookupData }: any) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const dialogRef = useRef(null);
  console.log("lookupData", lookupData);

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

    const token = localStorage.getItem("authToken");
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL2 + "/describe_t4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vector_ids: ["6569,v_id24", "6569,v_id5"],
            flag: false,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch case details");
      }
      const data = await response.json();
      setCaseDetails(data.data);
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
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            Case Ref <ArrowRight className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="max-w-[500px] sm:max-w-[75%] w-full"
        >
          {/* <SheetHeader> */}
          {/* <SheetTitle>Are you absolutely sure?</SheetTitle> */}
          {/* <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription> */}
          {/* </SheetHeader> */}
          <ScrollArea className="flex-1 px-6 overflow-y-auto">
            <div className="space-y-6 mt-4">
              {/* Content */}
              {/* <div className="space-y-2">
                <h2 className="text-lg font-semibold">Request</h2>
                <p className="text-sm text-muted-foreground">
                  {drawerData.data.user_query}
                </p>
              </div> */}

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Response</h2>
                <p className="text-sm text-muted-foreground">
                  {lookupData.content}
                </p>
              </div>

              <div className="space-y-2">
                {/* <h2 className="text-lg font-semibold">Referenced Cases</h2> */}
                <Accordion type="single" collapsible className="w-full">
                  {Object.keys(lookupData.lookup).map((key) => {
                    const caseItem = lookupData.lookup[key];
                    return (
                      <AccordionItem key={key} value={key}>
                        <AccordionTrigger className="text-sm font-medium cursor-pointer">
                          {caseItem[4]}
                        </AccordionTrigger>
                        <AccordionContent>
                          <Card className="border-0 shadow-none">
                            <CardContent className="p-3 space-y-2">
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Case Name
                                </span>
                                <span className="text-xs">{caseItem[0]}</span>
                              </div>
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Court:
                                </span>
                                <span className="text-xs">{caseItem[0]}</span>
                              </div>
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Judge:
                                </span>
                                <span className="text-xs">{caseItem[5]}</span>
                              </div>
                              <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Case ID:
                                </span>
                                <span className="text-xs">{key}</span>
                              </div>
                              {/* View More Details */}
                              <div className="flex justify-end mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs flex items-center gap-1 cursor-pointer"
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
        <DialogContent className="min-w-[95%] h-[95%]">
          <DialogHeader>
            <DialogTitle className="text-xl">{}</DialogTitle>
            <DialogDescription>{}</DialogDescription>
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
                  <span>{}</span>
                </div>
                {/* Court Name */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Court:</span>
                  <span>{}</span>
                </div>
                {/* Case Number */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Case Number:</span>
                  <span>{}</span>
                </div>
                {/* Judge */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Judge:</span>
                  <span>{}</span>
                </div>
                {/* Parties */}
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium">Parties:</span>
                  <span>{}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Summary</h3>
                  <p className="text-sm">{}</p>
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
    </>
  );
}
