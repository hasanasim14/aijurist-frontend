"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordStepProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  passwordError: string;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
}

export function PasswordStep({
  formData,
  setFormData,
  passwordError,
  setPasswordError,
}: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    setFormData((prevState: any) => ({
      ...prevState,
      [id]: value,
    }));

    // Only check password match when both fields have values and one of them changes
    if (
      (id === "password" || id === "confirmPassword") &&
      formData.password &&
      formData.confirmPassword
    ) {
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

  return (
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
    </>
  );
}
