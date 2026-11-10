import type { ComponentProps, ReactNode } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/utils/format";

import { FormField, type FormFieldBaseProps } from "./FormField";

type Base<T extends FieldValues, N extends FieldPath<T>> = FormFieldBaseProps<T, N>;

/** Matnli input. `addon` — chap tomondagi belgi/ikon */
export function FormInput<T extends FieldValues, N extends FieldPath<T>>({
  placeholder,
  type = "text",
  addon,
  inputMode,
  autoFocus,
  ...props
}: Base<T, N> & {
  placeholder?: string;
  type?: ComponentProps<"input">["type"];
  inputMode?: ComponentProps<"input">["inputMode"];
  addon?: ReactNode;
  autoFocus?: boolean;
}) {
  return (
    <FormField
      {...props}
      render={({ field, id, invalid }) =>
        addon ? (
          <InputGroup>
            <InputGroupAddon>{addon}</InputGroupAddon>
            <InputGroupInput
              id={id}
              type={type}
              inputMode={inputMode}
              placeholder={placeholder}
              aria-invalid={invalid}
              autoFocus={autoFocus}
              {...field}
              value={field.value ?? ""}
            />
          </InputGroup>
        ) : (
          <Input
            id={id}
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            aria-invalid={invalid}
            autoFocus={autoFocus}
            {...field}
            value={field.value ?? ""}
          />
        )
      }
    />
  );
}

/** Pul summasi: "1 250 000" ko'rinishida yoziladi, formaga son sifatida qaytadi */
export function FormMoneyInput<T extends FieldValues, N extends FieldPath<T>>({
  currency,
  placeholder = "0",
  ...props
}: Base<T, N> & { currency: string; placeholder?: string }) {
  return (
    <FormField
      {...props}
      render={({ field, id, invalid }) => (
        <InputGroup>
          <InputGroupInput
            id={id}
            inputMode="numeric"
            placeholder={placeholder}
            aria-invalid={invalid}
            className="tabular-nums"
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            value={
              field.value === undefined || field.value === ""
                ? ""
                : formatNumber(Number(field.value))
            }
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              field.onChange(digits === "" ? "" : Number(digits));
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>{currency}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )}
    />
  );
}

export function FormTextarea<T extends FieldValues, N extends FieldPath<T>>({
  placeholder,
  rows = 3,
  ...props
}: Base<T, N> & { placeholder?: string; rows?: number }) {
  return (
    <FormField
      {...props}
      render={({ field, id, invalid }) => (
        <Textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={invalid}
          {...field}
          value={field.value ?? ""}
        />
      )}
    />
  );
}

export function FormSelect<T extends FieldValues, N extends FieldPath<T>>({
  options,
  placeholder,
  ...props
}: Base<T, N> & {
  options: { value: string; label: ReactNode }[];
  placeholder?: string;
}) {
  return (
    <FormField
      {...props}
      render={({ field, id, invalid }) => (
        <Select value={field.value ?? ""} onValueChange={field.onChange}>
          <SelectTrigger id={id} aria-invalid={invalid} className="w-full" onBlur={field.onBlur}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

/** Gorizontal: chapda label+izoh, o'ngda switch */
export function FormSwitch<T extends FieldValues, N extends FieldPath<T>>(props: Base<T, N>) {
  return (
    <FormField
      {...props}
      orientation="horizontal"
      className="rounded-lg border p-3"
      render={({ field, id }) => (
        <Switch id={id} checked={Boolean(field.value)} onCheckedChange={field.onChange} />
      )}
    />
  );
}
