"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { baseURL } from "@/lib/utils";

interface OTPVerificationStepProps {
  formData: {
    otp: string;
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  email: string;
}

export function OTPVerificationStep({
  formData,
  setFormData,
  email,
}: OTPVerificationStepProps) {
  const [otpCooldown, setOtpCooldown] = useState(10);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const res = await fetch(baseURL + "/resend_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setOtpCooldown(120); // Reset cooldown after resending
      const data = await res.json();
      console.log("Data=>", data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          We`&apos;`ve sent a verification code to your email address. Please
          enter the code below to complete your registration.
        </p>
      </div>
      <div className="space-y-2 flex flex-col items-center">
        <Label htmlFor="otp">Verification Code</Label>
        <InputOTP
          maxLength={6}
          value={formData.otp}
          onChange={(value) =>
            /* eslint-disable @typescript-eslint/no-explicit-any */
            setFormData((prev: any) => ({ ...prev, otp: value }))
          }
        >
          <InputOTPGroup className="space-x-4 m-4">
            {[...Array(6)].map((_, index) => (
              <InputOTPGroup key={index}>
                <InputOTPSlot index={index} />
              </InputOTPGroup>
            ))}
          </InputOTPGroup>
        </InputOTP>

        {/* Resend Code Button */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1.5 h-8"
            onClick={handleResendOTP}
            disabled={otpCooldown > 0 || isResending}
          >
            {isResending ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {otpCooldown > 0
              ? `Resend code (${Math.floor(otpCooldown / 60)}:${(
                  otpCooldown % 60
                )
                  .toString()
                  .padStart(2, "0")})`
              : "Resend Code"}
          </Button>
        </div>
      </div>
    </>
  );
}
