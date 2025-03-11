"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  // Set and show password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    city: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "password" || id === "confirmPassword") {
      if (
        formData.password.length > 0 &&
        formData.confirmPassword.length > 0 &&
        id === "confirmPassword"
      ) {
        setPasswordError(
          value !== formData.password ? "Passwords do not match!" : ""
        );
      } else if (id === "password") {
        setPasswordError(
          value !== formData.confirmPassword ? "Passwords do not match!" : ""
        );
      }
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, city: value });
  };

  const nextStep = () => {
    console.log(`step ${step}`, formData);
    if (step === 2 && passwordError) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    // For demo purposes, we'll just show an alert
    alert("Signup successful!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
          <CardDescription className="text-center">
            Let&apos;s get you started!{" "}
            {step === 1
              ? "Enter your details below."
              : step === 2
              ? "Create your account."
              : "Verify your email."}
          </CardDescription>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === stepNumber
                        ? "bg-primary text-primary-foreground"
                        : step > stepNumber
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > stepNumber ? "✓" : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-10 h-1 ${
                        step > stepNumber ? "bg-primary/80" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Your Company"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select
                      onValueChange={handleSelectChange}
                      value={formData.city}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {cities.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Step 2: Account Information */}
              {step === 2 && (
                <>
                  <div className="relative space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="relative space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </>
              )}

              {/* Step 3: OTP Verification */}
              {step === 3 && (
                <>
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      We&apos;ve sent a verification code to your email address.
                      Please enter the code below to complete your registration.
                    </p>
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <Label htmlFor="otp">Verification Code</Label>
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={(value) =>
                        setFormData({ ...formData, otp: value })
                      }
                    >
                      <InputOTPGroup className="space-x-4 m-4">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="cursor-pointer mt-4"
              >
                <ChevronLeft /> Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                className={`${step > 1 ? "" : "w-full"} cursor-pointer mt-4`}
                onClick={nextStep}
              >
                Next <ChevronRight />
              </Button>
            ) : (
              <Button
                type="submit"
                className={`${step > 1 ? "" : "w-full"} cursor-pointer mt-4`}
                onClick={() => router.push("/")}
                disabled={step === 2 && !!passwordError}
              >
                Complete Signup <ChevronRight />
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
