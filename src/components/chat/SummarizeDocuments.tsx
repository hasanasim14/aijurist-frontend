"use client";

import { useEffect, useState } from "react";
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
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Case {
  id: string;
  citation: string;
  petitioner: string;
}

export function SummarizeDocuments() {
  // const [cases1, setCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  const handleClick = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL2 + "/cases_show",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ page: 1, per_page: 10, searchTerm: "" }),
        }
      );
      const data = await res.json();
      console.log("ases", data);
    } catch (error) {
      console.error(error);
    }
  };

  // Mock data - replace with your actual data source
  const cases: Case[] = [
    {
      id: "1",
      citation: "1981 SLD 2001, (1981) 132 ITR 369",
      petitioner: "Hemandass Dhanrajmal v. Commissioner of IncomE tax",
    },
    {
      id: "2",
      citation: "1983 SLD 2001, 1983 PLC 1186",
      petitioner:
        "MANSUR ALI KHAN vs SECRETARY TO GOVERNMENT OF PUNJAB, EDUCATION DEPARTMENT AND 2 OTHERS",
    },
    {
      id: "3",
      citation: "1984 SLD 2001, 1984 PLC 1693",
      petitioner: "TUREJ AHMED vs D.I.G. OF POLICE, MULTAN RANGE AND 26 OTHERS",
    },
    {
      id: "4",
      citation: "1985 SLD 2001, 1985 PLC 609",
      petitioner:
        "NAWAB DIN vs ADDITIONAL DEPUTY COMMISSIONER (GENERAL), VEHARI AND ANOTHER",
    },
    {
      id: "5",
      citation: "1986 SLD 1058, 1986 SCMR 2001",
      petitioner: "FEDERATION OF PAKISTAN- vs NAZIR AHMAD SWATI and another",
    },
    {
      id: "6",
      citation: "1986 SLD 2001, 1986 PLC 280",
      petitioner: "AGRICULTURE ENGINEER, TALAGANG vs GULZAR HUSSAIN",
    },
    {
      id: "7",
      citation: "1989 SLD 2001, 1989 PLC 892",
      petitioner: "KHADIM HUSSAIN vs CLIMAX ENGINEERING COMPANY LTD.",
    },
    {
      id: "8",
      citation: "1989 SLD 2001, 1989 SCMR 1980",
      petitioner: "HAKIM JALAL KHAN vs HAMID AUGUSTIN and others",
    },
    {
      id: "9",
      citation:
        "2001 SLD 168, 2001 PTD 1236, (1966) 62 ITR 2, (2001) 83 TAX 162",
      petitioner:
        "COMMISSIONER OF INCOME TAX Vs. KARNAL COOPERATIVE SUGAR MILLS LTD.",
    },
    {
      id: "10",
      citation: "1991 SLD 2001, 1991 PLC 1056",
      petitioner:
        "Agha RAFIQ AHMAD vs SECRETARY, FOOD DEPARTMENT and 23 others Agha RAFIQ AHMAD vs SECRETARY, FOOD DEPARTMENT and 23 others",
    },
  ];

  const filteredCases = cases.filter(
    (c) =>
      c.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.petitioner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCheckCase = (id: string) => {
    setSelectedCases((prev) =>
      prev.includes(id) ? prev.filter((caseId) => caseId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    // Handle the submission of selected cases
    console.log("Selected cases:", selectedCases);
    // Add your logic here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={handleClick}
          className="flex items-center gap-1 h-10 rounded-2xl border transition cursor-pointer whitespace-nowrap text-black"
        >
          <ScrollText size={16} className="text-gray-600 mr-1" />
          <span className="text-sm">Summarise</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Summary Cases
          </DialogTitle>
          <DialogDescription>Select cases to summarize them</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-hidden flex flex-col">
          {/* Search bar */}
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="overflow-y-auto flex-1 border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                {paginatedCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedCases.includes(caseItem.id)}
                        onCheckedChange={() => handleCheckCase(caseItem.id)}
                      />
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {caseItem.citation}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {caseItem.petitioner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              {filteredCases.length > 0 ? (
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredCases.length)}{" "}
                  of {filteredCases.length} results
                </span>
              ) : (
                <span>No results found</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  &lsaquo;
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  if (pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  &rsaquo;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </Button>
              </div>
            </div>
            {/* Select */}
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">10 Per Page</SelectItem>
                  <SelectItem value="banana">20 Per Page</SelectItem>
                  <SelectItem value="blueberry">50 Per Page</SelectItem>
                  <SelectItem value="grapes">100 Per Page</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedCases.length === 0}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
