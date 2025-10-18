import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectItem {
  label: string;
  value: string;
}

interface FormSelectFieldProps {
  name: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  items: SelectItem[];
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  name,
  className,
  placeholder,
  disabled = false,
  items,
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
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full",
                error && "border-destructive focus-visible:ring-destructive/50",
                className,
              )}
              aria-invalid={error ? "true" : "false"}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export default FormSelectField;
