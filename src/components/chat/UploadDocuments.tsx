"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUp, Upload, Plus, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import axios from "axios";
import NotLoggedInModal from "../NotLoggedInModal";

interface FileData {
  id: string;
  file: string;
}

interface UploadDocumentsProps {
  onFileUploaded: (fileName: string) => void;
}

export function UploadDocuments({ onFileUploaded }: UploadDocumentsProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchFiles();
    }
  }, [open]);

  const fetchFiles = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("authToken");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user_files`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await res.json();

      if (data?.detail?.message === "User Logged Out") {
        setOpenLogoutModal(true);
        console.log("Logged out");
      }

      // Convert the response to interface
      const formattedFiles = data.data.map((file: string, index: number) => ({
        id: `file-${index}`,
        file,
      }));
      setFiles(formattedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/delete_files",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            fileIds: [fileName],
            delAll: false,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete file");
      }

      toast.success("File deleted successfully");

      setFiles(files.filter((file) => file.file !== fileName));
      setSelectedFiles(
        selectedFiles.filter((id) => {
          const file = files.find((f) => f.file === fileName);
          return file ? id !== file.id : true;
        })
      );
    } catch (error) {
      toast.error("Failed to delete file");
      console.error("Delete error:", error);
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      const selectedFileNames = files
        .filter((file) => selectedFiles.includes(file.id))
        .map((file) => file.file);

      onFileUploaded(selectedFileNames.join(", "));
      setSelectedFiles([]);
    }
    setOpen(false);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    // Validation
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const allowedExtensions = [".pdf", ".txt", ".docx"];

    for (const file of selectedFiles) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        !allowedTypes.includes(file.type) ||
        !allowedExtensions.includes(`.${fileExtension}`)
      ) {
        toast.error(
          "Unsupported file type. Only PDF, DOCX, and TXT files are allowed."
        );
        return;
      }

      //Checking for files with duplicate names
      const fileExists = files.some(
        (existingFile) => existingFile.file === file.name
      );
      if (fileExists) {
        toast.error(`A file with the same name "${file.name}" already exists`);
        return;
      }
    }

    setUploading(true);
    const token = sessionStorage.getItem("authToken");

    try {
      const formData = new FormData();
      formData.append("file", selectedFiles[0]);

      await axios.post(
        "https://devlegal.ai-iscp.com/user_upload_data",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("File uploaded successfully!");
      // After successful upload, update the chat input
      onFileUploaded(selectedFiles[0].name);
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage || "Upload failed. Please try again.");
      } else {
        toast.error("Network error occurred");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <NotLoggedInModal open={openLogoutModal} />
      <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogHeader className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  User Files
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Select documents to use
                </DialogDescription>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />
                <Button
                  onClick={triggerFileUpload}
                  variant="outline"
                  className="flex items-center gap-1 p-1 cursor-pointer"
                  disabled={uploading}
                >
                  <Plus className="h-4 w-4" />
                  <span>{uploading ? "Uploading..." : "Upload New File"}</span>
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1 border rounded-md mb-2 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-4 text-center text-sm text-gray-500"
                      >
                        Loading files...
                      </td>
                    </tr>
                  ) : files.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-4 text-center text-sm text-gray-500"
                      >
                        No files found. Upload some files to get started.
                      </td>
                    </tr>
                  ) : (
                    files.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-3 whitespace-nowrap">
                          <Checkbox
                            checked={selectedFiles.includes(file.id)}
                            onCheckedChange={() => handleFileSelect(file.id)}
                            className="cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td
                          className="px-3 py-3 text-sm text-gray-900 whitespace-normal break-words min-w-[200px] cursor-pointer"
                          onClick={() => handleFileSelect(file.id)}
                        >
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate hover:text-clip hover:whitespace-normal">
                              {file.file}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFileToDelete(file);
                              }}
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <Trash2Icon className="w-5 h-5 text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={!!fileToDelete}
            onOpenChange={(open) => !open && setFileToDelete(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete File</DialogTitle>
                <DialogDescription className="text-black">
                  Are you sure you want to delete{" "}
                  <span className="font-bold">
                    &quot;{fileToDelete?.file}&quot;
                  </span>{" "}
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setFileToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={async () => {
                    if (fileToDelete) {
                      console.log("file name", fileToDelete.file);
                      await handleDeleteFile(fileToDelete.file);
                      setFileToDelete(null);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex justify-end gap-2">
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
              disabled={selectedFiles.length === 0}
              size="sm"
              className="cursor-pointer"
            >
              {selectedFiles.length > 0
                ? `Use ${selectedFiles.length} file${
                    selectedFiles.length > 1 ? "s" : ""
                  }`
                : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
