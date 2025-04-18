"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotLoggedInModal({ open }: { open: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const logOut = async () => {
      const authToken = sessionStorage.getItem("authToken") || "";
      try {
        await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/logout_user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authToken }),
        });
        sessionStorage.removeItem("authToken");

        const timer = setTimeout(() => {
          router.push("/login");
        }, 2000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    logOut();
  }, [open, router]);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] text-center [&>button]:hidden">
        <div className="flex justify-center mb-4">
          <CircleX className="h-20 w-20 text-red-500" />
        </div>
        <DialogHeader className="mt-2">
          <DialogTitle className="sr-only">Edit profile</DialogTitle>
          <h3 className="text-2xl font-bold text-gray-900 text-center">
            Session Expired
          </h3>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-800">
              Your session has expired
            </p>
            <p className="text-gray-600 text-sm">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
