"use client";

import FormTextField from "@/components/formFields/form-textfield";
import { Button } from "@/components/ui/button";
import { SignupFormType, signupSchema } from "@/types/forms/signup-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface SignupFormProps {
  loading?: boolean;
  disabled?: boolean;
  handleSubmit: (data: SignupFormType) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  loading = false,
  disabled = false,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormType) => {
    handleSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormTextField
            name="firstName"
            placeholder="First name"
            disabled={disabled || loading}
          />

          <FormTextField
            name="lastName"
            placeholder="Last name"
            disabled={disabled || loading}
          />
        </div>

        <FormTextField
          name="email"
          type="email"
          placeholder="Enter your email"
          disabled={disabled || loading}
        />

        <FormTextField
          name="password"
          placeholder="Create a password"
          disabled={disabled || loading}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          }
        />

        <FormTextField
          name="confirmPassword"
          placeholder="Confirm your password"
          disabled={disabled || loading}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          }
        />

        <Button type="submit" disabled={disabled || loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
