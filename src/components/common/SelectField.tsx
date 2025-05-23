import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  name: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
    description?: string;
  }[];
};

export type SelectFieldProps = {
  hookedForm: UseFormReturn<any>;
  field: SelectProps;
  className?: string;
  description?: string;
};

export const SelectField = ({
  hookedForm,
  field,
  className,
  description,
}: SelectFieldProps) => {
  // Get current value
  const currentValue = hookedForm.watch(field.name);

  // Find the corresponding label
  const currentLabel = currentValue
    ? field.options.find((opt) => String(opt.value) === String(currentValue))
        ?.label || ""
    : "";

  return (
    <FormField
      control={hookedForm.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={cn("flex flex-col space-y-2", className)}>
          {field.label && (
            <FormLabel className="text-sm">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select onValueChange={formField.onChange} value={formField.value}>
              <SelectTrigger className="mb-0 w-full shadow-none">
                <SelectValue placeholder={field.placeholder ?? "Select"}>
                  {currentLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-[1001]">
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col items-start justify-center">
                      <p
                        className={cn(
                          "text-black",
                          option.value !== "" && option.description && "mb-0.5",
                        )}
                      >
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && (
            <FormDescription className="mt-2">{description}</FormDescription>
          )}
          <FormMessage className="mt-2" />
        </FormItem>
      )}
    />
  );
};
