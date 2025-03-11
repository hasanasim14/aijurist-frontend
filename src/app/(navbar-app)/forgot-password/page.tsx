"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader className="space-y-1 mt-4">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email so that we can send you a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full mb-2">
              Send Email
            </Button>
          </div>
          <div className="mt-4 text-sm flex justify-center">
            <p>
              <Link
                href="/login"
                className="text-black hover:underline flex items-center gap-1"
              >
                <ChevronLeft /> Back to Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
