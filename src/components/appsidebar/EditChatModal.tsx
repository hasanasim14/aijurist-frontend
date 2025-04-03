"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditChatModalProps {
  chat: { id: number; title: string } | null;
  onSave: (newTitle: string) => Promise<void>;
  onCancel: () => void;
  defaultTitle: string;
}

export function EditChatModal({
  chat,
  onSave,
  onCancel,
  defaultTitle,
}: EditChatModalProps) {
  // Use a ref instead of state for better performance
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set the initial value when the modal opens
    if (chat && inputRef.current) {
      inputRef.current.value = defaultTitle;
      // Focus the input after it's rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [chat, defaultTitle]);

  if (!chat) return null;

  const handleSave = () => {
    const value = inputRef.current?.value.trim() || "";
    if (value) {
      onSave(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">Rename Chat</h3>
        <div className="mb-6">
          <label
            htmlFor="chat-title"
            className="block text-sm font-medium mb-2"
          >
            New Title
          </label>
          <Input
            id="chat-title"
            ref={inputRef}
            defaultValue={defaultTitle}
            placeholder="Enter new chat title"
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputRef.current?.value.trim()) {
                handleSave();
              }
            }}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            className="cursor-pointer"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
