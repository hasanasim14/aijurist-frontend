"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteChatModalProps {
  chat: { id: number; title: string } | null;
  onDelete: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteChatModal({
  chat,
  onDelete,
  onCancel,
}: DeleteChatModalProps) {
  if (!chat) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium mt-4 text-center">
            Are you sure?
          </h3>
        </div>

        {/* Description */}
        <p className="mb-6 text-center">
          Are you sure you want to delete the chat &quot;
          <br />
          <span className="font-bold">{chat.title} ?&quot;</span>
          <br />
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex flex-col space-y-2">
          <Button
            variant="destructive"
            onClick={onDelete}
            className="cursor-pointer"
          >
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
