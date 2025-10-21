import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface FormTextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  className?: string;
  label?: string;
}

const FormTextareaField: React.FC<FormTextareaFieldProps> = ({
  name,
  className,
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
          <Textarea
            {...field}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive/50",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
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

export default FormTextareaField;
