"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface FormTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  label?: string;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  className,
  startAdornment,
  endAdornment,
  label,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={name} className="mb-2.5 pl-1">
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            {startAdornment && (
              <div className="absolute top-1/2 left-3 z-10 -translate-y-1/2">
                {startAdornment}
              </div>
            )}

            <Input
              {...field}
              className={cn(
                error && "border-destructive focus-visible:ring-destructive/50",
                startAdornment && "pl-10",
                endAdornment && "pr-10",
                className
              )}
              aria-invalid={error ? "true" : "false"}
              {...props}
            />

            {endAdornment && (
              <div className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                {endAdornment}
              </div>
            )}
          </div>
        )}
      />

      {error && (
        <p className="text-destructive mt-1 text-sm">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default FormTextField;
