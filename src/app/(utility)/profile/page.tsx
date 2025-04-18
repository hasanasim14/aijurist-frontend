"use client";

import { Settings } from "@/components/profile/Settings";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Settings />
      </div>
    </main>
  );
}
