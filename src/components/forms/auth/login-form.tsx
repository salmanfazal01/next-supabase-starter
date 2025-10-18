"use client";

import FormTextField from "@/components/formFields/form-textfield";
import { Button } from "@/components/ui/button";
import { LoginFormType, loginSchema } from "@/types/forms/login-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface LoginFormProps {
  loading?: boolean;
  disabled?: boolean;
  handleSubmit: (data: LoginFormType) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading = false,
  disabled = false,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormType) => {
    handleSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormTextField
          name="email"
          type="email"
          placeholder="Enter your email"
          disabled={disabled || loading}
        />

        <FormTextField
          name="password"
          placeholder="Enter your password"
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
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
