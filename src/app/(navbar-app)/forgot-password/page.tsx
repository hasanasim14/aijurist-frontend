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
import { ChevronLeft, Loader2 } from "lucide-react";
import { baseURL } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });

  // email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // OnClick handler
  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setErrors({ email: "" });
    setIsLoading(true);

    try {
      const res = await fetch(baseURL + "/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE2OTI1MjY2MDAsImV4cCI6MTY5MjUzMDIwMH0.4a8jN3wSgWq9KZoEjNw73CmYOmTQd2d6ZtF2rQqkH0A",
        }),
      });

      if (res.ok) {
        toast.success("Password Reset Link sent");
      } else {
        toast.error("Failed to send password reset link.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // on pressing enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "ENTER") {
      e.preventDefault();
      handlePasswordReset();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader className="space-y-1 mt-4">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email so that we can send you a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onKeyDown={handleKeyDown}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    if (errors.email) {
                      if (validateEmail(value)) {
                        setErrors({ email: "" });
                      }
                    }
                  }}
                  required
                />

                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <Button
                onClick={handlePasswordReset}
                className="w-full mb-2"
                disabled={isLoading || email === "" || errors.email !== ""}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sending Email
                  </>
                ) : (
                  "Send Email"
                )}
              </Button>
            </div>
          </form>

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
