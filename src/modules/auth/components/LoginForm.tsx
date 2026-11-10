import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { FormField } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { delay } from "@/lib/mock/random";
import { msg, v } from "@/lib/validation";
import { DEMO_USER, useAuthStore } from "@/stores/auth.store";

const schema = z.object({
  phone: v.phone(),
  password: z.string().min(4, msg("validation.minLength", { min: 4 })),
  remember: z.boolean(),
});
type LoginValues = z.infer<typeof schema>;

/** Telefon maskasi: "998901234567" → "90 123 45 67" */
function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

/** Shisha ustidagi input — yarim shaffof, fokusda aniqroq */
const fieldClass =
  "h-12 rounded-xl border-foreground/10 bg-background/55 transition-colors has-[[data-slot=input-group-control]:focus-visible]:bg-background/80 dark:bg-background/30";

export function LoginForm({ redirect }: { redirect?: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "998901234567", password: "", remember: true },
  });
  const remember = useWatch({ control: form.control, name: "remember" });
  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: LoginValues) {
    await delay(null, 700); // mock so'rov
    login({ ...DEMO_USER, phone: `+${values.phone}` }, "demo-token");
    toast.success(t("auth.welcome"));
    await navigate({ to: redirect ?? "/" });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField
        control={form.control}
        name="phone"
        label={t("auth.phone")}
        render={({ field, id, invalid }) => (
          <InputGroup className={fieldClass}>
            <InputGroupAddon className="pl-4 text-sm font-medium text-muted-foreground tabular-nums">
              +998
            </InputGroupAddon>
            <InputGroupInput
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={invalid}
              placeholder="90 123 45 67"
              value={maskPhone(field.value)}
              onChange={(e) =>
                field.onChange(`998${e.target.value.replace(/\D/g, "").slice(0, 9)}`)
              }
              onBlur={field.onBlur}
              ref={field.ref}
              className="text-base tabular-nums"
            />
          </InputGroup>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        label={t("auth.password")}
        render={({ field, id, invalid }) => (
          <InputGroup className={fieldClass}>
            <InputGroupInput
              id={id}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={invalid}
              placeholder="••••••••"
              className="pl-4 text-base"
              autoFocus
              {...field}
            />
            <InputGroupAddon align="inline-end" className="pr-2">
              <InputGroupButton
                size="icon-sm"
                className="rounded-lg"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={t("auth.password")}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(c) => form.setValue("remember", Boolean(c))}
          />
          <Label htmlFor="remember" className="font-normal text-muted-foreground">
            {t("auth.remember")}
          </Label>
        </div>
        <button
          type="button"
          className="rounded text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("auth.forgot")}
        </button>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="group h-12 w-full rounded-xl text-[0.9375rem] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25),0_8px_24px_-8px_var(--color-primary)] transition-[transform,box-shadow] active:scale-[0.99]"
      >
        {submitting && <Spinner />}
        {t("auth.submit")}
        {!submitting && (
          <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
        )}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-foreground/10" />
        {t("auth.or")}
        <span className="h-px flex-1 bg-foreground/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-xl border-foreground/10 bg-background/40 hover:bg-background/70 dark:bg-background/20"
      >
        <MessageSquareIcon />
        {t("auth.smsLogin")}
      </Button>

      <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground">
        <ShieldCheckIcon className="size-3.5 text-success" />
        {t("auth.secure")}
      </p>
    </form>
  );
}
