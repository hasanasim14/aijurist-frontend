"use client";

import { Settings } from "@/components/profile/Settings";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f9fafb] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Settings />
        <Button
          className="mt-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Chat
        </Button>
      </div>
    </main>
  );
}
