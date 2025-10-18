import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RadioItem {
  label: string;
  value: string;
}

interface FormRadioProps {
  name: string;
  className?: string;
  disabled?: boolean;
  items: RadioItem[];
}

const FormRadio: React.FC<FormRadioProps> = ({
  name,
  className,
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
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive/50",
              className,
            )}
            aria-invalid={error ? "true" : "false"}
          >
            {items.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={item.value}
                  id={`${name}-${item.value}`}
                  {...props}
                />

                <Label
                  htmlFor={`${name}-${item.value}`}
                  className={cn(error && "text-destructive")}
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
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

export default FormRadio;
