import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  name: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  className,
  label,
  disabled = false,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn(
                error && "border-destructive focus-visible:ring-destructive/50",
                className,
              )}
              aria-invalid={error ? "true" : "false"}
              {...props}
            />

            {label && (
              <Label htmlFor={name} className={cn(error && "text-destructive")}>
                {label}
              </Label>
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

export default FormCheckbox;
