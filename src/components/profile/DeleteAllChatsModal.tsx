"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteAllChatsModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAllChatsModal({
  email,
  isOpen,
  onClose,
}: DeleteAllChatsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAllChats = async () => {
    setIsDeleting(true);
    const token = sessionStorage.getItem("authToken");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/delete_chats",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (response.ok) {
        toast.success("All chats deleted successfully!");
      } else {
        toast.error("Failed to delete chats");
      }
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("An error occurred while deleting chats");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium mt-4 text-center">
            Are you sure?
          </h3>
        </div>

        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
          Are you sure you want to delete all your chats?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex flex-col space-y-2">
          <Button
            variant="destructive"
            onClick={handleDeleteAllChats}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete All Chats"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
