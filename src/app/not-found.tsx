"use client"; // Required if you're using Next.js App Router for navigation

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white">
      <img
        src="/logo.png"
        alt="Page Not Found"
        className="w-72 max-w-full mb-8"
      />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>

      <Button
        onClick={() => router.push("/")}
        className="px-6 py-3 cursor-pointer"
      >
        Go Back to Chat
      </Button>
    </div>
  );
}
