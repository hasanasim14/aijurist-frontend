"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";

export function UploadDocuments() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 cursor-pointer"
        >
          <Upload className="h-5 w-5" />
          <span className="sr-only">Upload</span>
        </Button>
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
