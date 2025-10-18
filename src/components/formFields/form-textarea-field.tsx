import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  className?: string;
}

const FormTextareaField: React.FC<FormTextareaFieldProps> = ({
  name,
  className,
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
          <Textarea
            {...field}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive/50",
              className,
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
