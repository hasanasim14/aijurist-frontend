"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";

interface PasswordStepProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  passwordError: string;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setAllValidationsPassed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PasswordStep({
  formData,
  setFormData,
  setPasswordError,
  setAllValidationsPassed,
}: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    if (formData.password) {
      setValidations({
        hasMinLength: formData.password.length >= 8,
        hasUpperCase: /[A-Z]/.test(formData.password),
        hasLowerCase: /[a-z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
        passwordsMatch: formData.password === formData.confirmPassword,
      });
    } else {
      setValidations({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        passwordsMatch: false,
      });
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const allValid =
      validations.hasMinLength &&
      validations.hasUpperCase &&
      validations.hasLowerCase &&
      validations.hasNumber &&
      validations.passwordsMatch;

    setAllValidationsPassed(allValid);
  }, [validations]);

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

      <div className="mt-4 space-y-1 text-sm">
        <p className="font-medium text-gray-700 mb-1">Password must:</p>
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center gap-2">
            {validations.passwordsMatch ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span
              className={
                validations.passwordsMatch ? "text-green-700" : "text-red-500"
              }
            >
              Passwords must match
            </span>
          </div>
          <div className="flex items-center gap-2">
            {validations.hasMinLength ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span
              className={
                validations.hasMinLength ? "text-green-700" : "text-red-500"
              }
            >
              Have at least 8 characters
            </span>
          </div>
          <div className="flex items-center gap-2">
            {validations.hasUpperCase ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span
              className={
                validations.hasUpperCase ? "text-green-700" : "text-red-500"
              }
            >
              Contain a capital letter
            </span>
          </div>
          <div className="flex items-center gap-2">
            {validations.hasLowerCase ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span
              className={
                validations.hasLowerCase ? "text-green-700" : "text-red-500"
              }
            >
              Contain a lowercase letter
            </span>
          </div>
          <div className="flex items-center gap-2">
            {validations.hasNumber ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span
              className={
                validations.hasNumber ? "text-green-700" : "text-red-500"
              }
            >
              Contain a number
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
