import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { translateError } from "@/lib/validation";
import { cn } from "@/utils/cn";

export interface FormFieldBaseProps<T extends FieldValues, N extends FieldPath<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zod transform (input ≠ output) bilan ham ishlashi uchun
  control: Control<T, any, any>;
  name: N;
  label?: ReactNode;
  description?: ReactNode;
  optional?: boolean;
  className?: string;
}

/**
 * Har forma maydoni uchun asos: label + boshqaruv elementi + izoh + tarjima qilingan xato.
 * `htmlFor`/`aria-invalid` avtomatik. Aniq maydonlar (FormInput, FormSelect…) shuning ustiga qurilgan.
 *
 *   <FormField control={form.control} name="name" label="Nomi"
 *     render={({ field, id, invalid }) => <Input id={id} aria-invalid={invalid} {...field} />} />
 */
export function FormField<T extends FieldValues, N extends FieldPath<T>>({
  control,
  name,
  label,
  description,
  optional,
  className,
  orientation = "vertical",
  render,
}: FormFieldBaseProps<T, N> & {
  orientation?: "vertical" | "horizontal";
  render: (ctx: { field: ControllerRenderProps<T, N>; id: string; invalid: boolean }) => ReactNode;
}) {
  const { t } = useTranslation();
  const id = `f-${String(name).replace(/\./g, "-")}`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = Boolean(fieldState.error);
        const error = translateError(fieldState.error?.message);
        const labelNode = label && (
          <FieldLabel htmlFor={id}>
            {label}
            {optional && (
              <span className="font-normal text-muted-foreground">({t("common.optional")})</span>
            )}
          </FieldLabel>
        );

        if (orientation === "horizontal") {
          return (
            <Field orientation="horizontal" data-invalid={invalid} className={className}>
              <FieldContent>
                {labelNode}
                {description && <FieldDescription>{description}</FieldDescription>}
              </FieldContent>
              {render({ field, id, invalid })}
            </Field>
          );
        }

        return (
          <Field data-invalid={invalid} className={cn("gap-2", className)}>
            {labelNode}
            {render({ field, id, invalid })}
            {description && !invalid && <FieldDescription>{description}</FieldDescription>}
            {invalid && <FieldError>{error}</FieldError>}
          </Field>
        );
      }}
    />
  );
}
