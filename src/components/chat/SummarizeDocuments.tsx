"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface Case {
  id: string;
  citation: string;
  petitioner: string;
}

export function SummarizeDocuments() {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const isMobile = useIsMobile();

  // Add this after your other state declarations
  useEffect(() => {
    console.log("Current page changed to:", currentPage);
  }, [currentPage]);

  // Fetch cases when dialog opens, page changes, or items per page changes
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        await fetchCases();
      };
      fetchData();
    }
  }, [open, currentPage, itemsPerPage, searchQuery]);

  // Move fetchCases outside of useEffect to avoid dependency issues
  const fetchCases = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token || !open) return;

    setLoading(true);
    try {
      console.log(
        `Fetching page ${currentPage} with ${itemsPerPage} items per page`
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL2}/cases_show`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            page: currentPage,
            per_page: itemsPerPage,
            searchTerm: searchQuery,
          }),
        }
      );
      const data = await res.json();
      console.log("API response:", data);

      if (data.data && data.data.documents) {
        setCases(data.data.documents);
        setTotalCount(data.data.total_count || data.data.documents.length);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setSelectedCases([]);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleCheckCase = (id: string) => {
    setSelectedCases((prev) =>
      prev.includes(id) ? prev.filter((caseId) => caseId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    // Handle the submission of selected cases
    console.log("Selected cases:", selectedCases);
    // Add your logic here
    setOpen(false);
  };

  // Calculate total pages based on total count from API
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  // const totalPages =

  console.log("Total pages:", totalPages);
  console.log("Total count:", totalCount);

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // You can adjust this number

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there aren't too many
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // Adjust if we're at the start or end
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (startPage > 1) {
        pages.unshift("...");
        pages.unshift(1);
      }
      if (endPage < totalPages) {
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    console.log("We could be heroes just for one day", currentPage);
  }, [currentPage]);

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen) handleDialogOpen();
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 h-10 rounded-2xl border transition cursor-pointer whitespace-nowrap text-black"
          size={isMobile ? "icon" : "default"}
        >
          <ScrollText
            size={16}
            className={`text-gray-600 mr-1 ${isMobile ? "" : ""}`}
          />
          {!isMobile && <span className="text-sm">Summarize</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold">
            Summary Cases
          </DialogTitle>
          <DialogDescription>Select cases to summarize them</DialogDescription>
        </DialogHeader>

        <div className="px-6 flex-1 overflow-hidden flex flex-col">
          {/* Search bar */}
          <div className="relative mt-2">
            <Input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pr-10 border rounded-md focus:ring-0 focus:outline-none focus:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Cases table */}
          <div className="overflow-y-auto flex-1 border rounded-md mb-4 mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    scope="col"
                    className="w-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  ></th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Citation
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Petitioner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-4 text-center text-sm text-gray-500"
                    >
                      Loading cases...
                    </td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-4 text-center text-sm text-gray-500"
                    >
                      No cases found
                    </td>
                  </tr>
                ) : (
                  cases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCheckCase(caseItem.id)}
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Checkbox
                          checked={selectedCases.includes(caseItem.id)}
                          onCheckedChange={() => handleCheckCase(caseItem.id)}
                          className="cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        {caseItem.citation}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        {caseItem.petitioner}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with pagination, select, and action buttons */}
        <div className="border-t px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Pagination controls - centered on mobile, inline on desktop */}
          <div className="flex justify-center sm:justify-start items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    // aria-disabled={currentPage === 1}
                    // aria-disabled={true}
                    href="#"
                    onClick={(e) => {
                      console.log("Clicked previous page");
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                    // disabled={currentPage === 1}
                  />
                </PaginationItem>
                {getPaginationNumbers().map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof pageNum === "number") {
                            setCurrentPage(pageNum);
                          }
                        }}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  {/* Next Button Pagination */}
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      // console.log(
                      //   "I would be king and you, you will be queen",
                      //   Math.min(totalPages, prev + 1)
                      // );

                      setCurrentPage(currentPage + 1);
                      // setCurrentPage(2);
                      // e.preventDefault();
                      // setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    // disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Action buttons and select - full width on mobile, inline on desktop */}
          <div className="flex items-center justify-between sm:justify-end gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10 Per Page</SelectItem>
                  <SelectItem value="20">20 Per Page</SelectItem>
                  <SelectItem value="50">50 Per Page</SelectItem>
                  <SelectItem value="100">100 Per Page</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                size="sm"
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedCases.length === 0}
                size="sm"
                className="cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
