"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  baseURL,
  // , cities
} from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";

export default function SignupPage() {
  // const router = useRouter();
  // Set and show password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [signupLoading, setSignupLoading] = useState(false);

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

  // Debounce function to limit API calls
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedEmail = useDebounce(formData.email, 500);

  const checkEmailExists = useCallback(
    async (isBlurEvent = false) => {
      // If it's a blur event, we want to check immediately if the email is valid
      const emailToCheck = isBlurEvent ? formData.email : debouncedEmail;

      if (!emailToCheck || !validateEmail(emailToCheck)) return;

      try {
        const res = await fetch(baseURL + "/validate_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailToCheck }),
        });

        const data = await res.json();

        if (data.message === "Email already registered.") {
          setEmailError("Email already registered");
        } else {
          setEmailError("");
        }
      } catch (error) {
        console.error("Error checking email:", error);
      }
    },
    [debouncedEmail, formData.email]
  );

  // Check email when debounced value changes
  useEffect(() => {
    if (debouncedEmail && debouncedEmail.includes("@")) {
      checkEmailExists();
    }
  }, [debouncedEmail, checkEmailExists]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if all required fields in the current step are filled
  const isStepValid = useMemo(() => {
    if (step === 1) {
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        emailValid &&
        !emailError &&
        formData.companyName.trim() !== ""
        //  &&formData.city !== ""
      );
    }
    return true;
  }, [formData, step, emailValid, emailError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Clear error for this field when user starts typing
    setFormErrors((prev) => ({
      ...prev,
      [id]: "",
    }));

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Validate email as user types
    if (id === "email") {
      const isValid = validateEmail(value);
      setEmailValid(isValid);
      if (!isValid && value.trim() !== "") {
        setFormErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      }
    }

    // Only check password match when both fields have values and one of them changes
    if (
      (id === "password" || id === "confirmPassword") &&
      formData.password &&
      formData.confirmPassword
    ) {
      // Use a setTimeout to defer the validation until after the state update
      setTimeout(() => {
        const updatedFormData = {
          ...formData,
          [id]: value,
        };

        setPasswordError(
          updatedFormData.password !== updatedFormData.confirmPassword
            ? "Passwords do not match!"
            : ""
        );
      }, 0);
    }
  };

  // const handleRegisteration = () => {
  //   alert("Registeration Call");
  //   console.log("Registeration Call");
  // };

  const handleRegisteration = async () => {
    setSignupLoading(true);
    try {
      const res = await fetch(baseURL + "/register_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "hasanai1",
          lastName: ":",
          // abc@example.com
          email: formData.email,
          password: formData.password,
          companyName: formData.password,
          // city: formData.city,
          city: "Karachi",
        }),
      });

      const data = await res.json();
      console.log("response=>", data);

      setStep(step + 1);

      // if ((data.response.success = "true")) {
      //   console.log("Yippie");
      // }
    } catch (error) {
      console.error(error);
      // const errorMessage =
      // error instanceof Error ? error.message : "Something went wrong!";
    } finally {
      setSignupLoading(false);
    }
  };

  // Check if email exists method

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (value.trim() === "") {
      setFormErrors((prev) => ({
        ...prev,
        [id]: "This field is required",
      }));
    }

    if (id === "email" && value.trim() !== "") {
      if (!validateEmail(value)) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
        setEmailValid(false);
      } else {
        setEmailValid(true);
        // Check if email exists on blur
        checkEmailExists(true);
      }
    }
  };

  const handleOTPValidation = async () => {
    console.log("otp ==>>, ", formData.otp);
    try {
      const res = await fetch(baseURL + "/verify_user_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await res.json();
      console.log("verify user otp is ", data);
      alert("Yippie");
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSelectChange = (value: string) => {
  //   setFormData({ ...formData, city: value });
  // };

  const nextStep = () => {
    console.log(`step ${step}`, formData);
    if (step === 2 && passwordError) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Here you would typically send the data to your backend
  //   console.log("Form submitted:", formData);
  //   // For demo purposes, we'll just show an alert
  //   // alert("Signup successful!");
  // };

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

        {/* <form onSubmit={handleSubmit}> */}
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
                    onBlur={handleBlur}
                    className={formErrors.firstName ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={formErrors.lastName ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={
                      formErrors.email || emailError ? "border-red-500" : ""
                    }
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                  {formErrors.email && (
                    <p className="text-red-500 text-sm">{formErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your Company"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={formErrors.companyName ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.companyName && (
                    <p className="text-red-500 text-sm">
                      {formErrors.companyName}
                    </p>
                  )}
                </div>
                {/* This is causing the application to run very slow but why? */}
                {/* <div className="space-y-2">
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
                </div> */}
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
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              disabled={signupLoading} // Disable when loading
            >
              <ChevronLeft /> Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              type="button"
              className={`${step > 1 ? "" : "w-full"} cursor-pointer mt-4`}
              onClick={() => {
                if (step === 2) {
                  handleRegisteration();
                } else {
                  nextStep();
                }
              }}
              disabled={signupLoading || (step === 1 && !isStepValid)} // Disable when loading or form is invalid
            >
              {signupLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Next <ChevronRight />
                </>
              ) : (
                <>
                  Next <ChevronRight />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="submit"
              className={`${step > 1 ? "" : "w-full"} cursor-pointer mt-4`}
              // onClick={() => router.push("/")}
              onClick={handleOTPValidation}
              disabled={signupLoading || (step === 2 && Boolean(passwordError))} // Disable when loading or if password error exists
            >
              Complete Signup <ChevronRight />
            </Button>
          )}
        </CardFooter>
        {/* </form> */}
      </Card>
    </div>
  );
}
