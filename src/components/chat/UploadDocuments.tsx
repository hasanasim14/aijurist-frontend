"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollText } from "lucide-react";

export function UploadDocuments() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="flex items-center gap-1 px-3 py-2 rounded-2xl border bg-gray-100 hover:bg-gray-200 transition cursor-pointer whitespace-nowrap">
          <ScrollText size={16} className="text-gray-600" />
          <span className="text-sm">Upload Documents</span>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {/* Summary Cases */}
          </DialogTitle>
          <DialogDescription>Upload Documents</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-hidden flex flex-col"></div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t"></div>
      </DialogContent>
    </Dialog>
  );
}
