"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white">
      <Image
        src="/logo.png"
        alt="Page Not Found"
        width={300}
        height={300}
        className="mb-8"
      />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you`&apos;`re looking for doesn `&apos;`t exist.
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
