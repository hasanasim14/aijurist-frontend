"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { baseURL } from "@/lib/utils";
import { BasicInfoStep } from "@/components/signup/StepOne";
import { PasswordStep } from "@/components/signup/StepTwo";
import { OTPVerificationStep } from "@/components/signup/StepThree";

export default function SignupPage() {
  type FormDataType = {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    city: string;
    password: string;
    confirmPassword: string;
    otp: string;
  };

  const [step, setStep] = useState(1);
  const [signupLoading, setSignupLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    city: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [emailValid, setEmailValid] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        emailValid &&
        !emailError &&
        formData.companyName.trim() !== "" &&
        formData.city !== ""
      );
    }
    return true;
  };

  const handleRegistration = async () => {
    setSignupLoading(true);
    try {
      const res = await fetch(baseURL + "/register_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          city: formData.city,
        }),
      });
      const data = await res.json();
      console.log("response=>", data);
      setStep(step + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setSignupLoading(false);
    }
  };

  const handleOTPValidation = async () => {
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

  const nextStep = () => {
    if (step === 2 && passwordError) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? "Enter your details below."
              : step === 2
              ? "Create your account."
              : "Verify your email."}
          </CardDescription>
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

        <CardContent>
          <div className="space-y-4">
            {step === 1 && (
              <BasicInfoStep
                {...{
                  formData,
                  setFormData,
                  formErrors,
                  setFormErrors,
                  emailError,
                  setEmailError,
                  emailValid,
                  setEmailValid,
                }}
              />
            )}
            {step === 2 && (
              <PasswordStep
                {...{ formData, setFormData, passwordError, setPasswordError }}
              />
            )}
            {step === 3 && (
              <OTPVerificationStep
                {...{ formData, setFormData, email: formData.email }}
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={signupLoading}
            >
              <ChevronLeft /> Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => (step === 2 ? handleRegistration() : nextStep())}
              disabled={signupLoading || (step === 1 && !isStepValid())}
            >
              {signupLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              Next <ChevronRight />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleOTPValidation}
              disabled={signupLoading}
            >
              Complete Signup <ChevronRight />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
