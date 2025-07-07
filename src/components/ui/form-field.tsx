import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormMessage } from "@/components/ui/form-message"
import { cn } from "@/lib/utils"

interface BaseFormFieldProps {
  label: string
  id: string
  error?: string
  success?: string
  warning?: string
  info?: string
  required?: boolean
  className?: string
  labelClassName?: string
  description?: string
}

interface InputFormFieldProps extends BaseFormFieldProps {
  type?: "input"
  inputProps?: React.ComponentProps<typeof Input>
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: "textarea"
  textareaProps?: React.ComponentProps<typeof Textarea>
}

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps

const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(({ label, id, error, success, warning, info, required, className, labelClassName, description, type = "input", ...props }, ref) => {
  const variant = error ? "error" : success ? "success" : warning ? "warning" : "default"
  const message = error || success || warning || info
  const messageVariant = error ? "error" : success ? "success" : warning ? "warning" : info ? "info" : "default"

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={id} 
        className={cn(
          "text-sm font-medium",
          error && "text-red-600",
          success && "text-green-600",
          warning && "text-amber-600",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {type === "textarea" ? (
        <Textarea
          id={id}
          variant={variant}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...(props as TextareaFormFieldProps).textareaProps}
        />
      ) : (
        <Input
          id={id}
          variant={variant}
          ref={ref as React.Ref<HTMLInputElement>}
          {...(props as InputFormFieldProps).inputProps}
        />
      )}
      
      {message && (
        <FormMessage variant={messageVariant}>
          {message}
        </FormMessage>
      )}
    </div>
  )
})

FormField.displayName = "FormField"

export { FormField }