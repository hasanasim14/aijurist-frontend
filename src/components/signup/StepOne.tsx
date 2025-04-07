"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/lib/utils";

interface BasicInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    city: string;
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  emailError: string;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  emailValid: boolean;
  setEmailValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BasicInfoStep({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  emailError,
  setEmailError,
  setEmailValid,
}: BasicInfoStepProps) {
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

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^@]+@[^.]+\..+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = useCallback(
    async (isBlurEvent = false) => {
      const emailToCheck = isBlurEvent ? formData.email : debouncedEmail;

      if (!emailToCheck || !validateEmail(emailToCheck)) return;

      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/validate_email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailToCheck }),
          }
        );

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
    [debouncedEmail, formData.email, setEmailError]
  );

  // Check email when debounced value changes
  useEffect(() => {
    if (debouncedEmail && debouncedEmail.includes("@")) {
      checkEmailExists();
    }
  }, [debouncedEmail, checkEmailExists]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormErrors((prev) => ({
      ...prev,
      [id]: "",
    }));

    setFormData((prevState: any) => ({
      ...prevState,
      [id]: value,
    }));

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
  };

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
        checkEmailExists(true);
      }
    }
  };

  const cityOptions = useMemo(() => {
    return cities.map(({ label, value }) => (
      <SelectItem key={value} value={value}>
        {label}
      </SelectItem>
    ));
  }, []);

  return (
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
          <p className="text-red-500 text-sm">{formErrors.firstName}</p>
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
          <p className="text-red-500 text-sm">{formErrors.lastName}</p>
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
          className={formErrors.email || emailError ? "border-red-500" : ""}
          required
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
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
          <p className="text-red-500 text-sm">{formErrors.companyName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select
          value={formData.city}
          onValueChange={(value) =>
            setFormData((prev: any) => ({ ...prev, city: value }))
          }
        >
          <SelectTrigger className="w-full text-base">
            <SelectValue placeholder="Select your city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>{cityOptions}</SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
