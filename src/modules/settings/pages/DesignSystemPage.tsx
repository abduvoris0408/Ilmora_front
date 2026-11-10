import {
  BanknoteIcon,
  BellIcon,
  InboxIcon,
  LayersIcon,
  PackageIcon,
  PaletteIcon,
  PlusIcon,
  SearchIcon,
  SquareStackIcon,
  Trash2Icon,
  TypeIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  EmptyState,
  IconBox,
  InfoList,
  Money,
  PageHeader,
  ResponsiveModal,
  SectionCard,
  SidePanel,
  StatCard,
  StatusBadge,
  TrendBadge,
  UserAvatar,
  type IconTone,
  type StatusKey,
} from "@/components/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { confirm, overlay } from "@/lib/overlays";

/**
 * DIZAYN TIZIMI KO'RGAZMASI — har bir tayyor komponent jonli holatda (joriy mavzu/rang/zichlik bilan).
 * Yangi komponent qo'shilsa — shu yerga ham namunasi qo'shiladi. Matnlar ataylab texnik (komponent nomlari).
 */

const TOKENS = [
  ["background", "bg-background border"],
  ["card", "bg-card border"],
  ["muted", "bg-muted"],
  ["accent", "bg-accent"],
  ["primary", "bg-primary"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["info", "bg-info"],
  ["destructive", "bg-destructive"],
  ["sidebar", "bg-sidebar border"],
  ["chart-1", "bg-chart-1"],
  ["chart-2", "bg-chart-2"],
  ["chart-3", "bg-chart-3"],
  ["chart-4", "bg-chart-4"],
  ["chart-5", "bg-chart-5"],
] as const;

const TONES: IconTone[] = ["neutral", "primary", "success", "warning", "danger", "info", "solid"];
const STATUSES: StatusKey[] = [
  "active",
  "pending",
  "completed",
  "cancelled",
  "refunded",
  "lowStock",
  "draft",
];

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function DesignSystemPage() {
  const { t } = useTranslation();

  const openModal = () =>
    overlay.open(({ open, close }) => (
      <ResponsiveModal
        open={open}
        onOpenChange={(v) => !v && close()}
        title="ResponsiveModal"
        description="sm+ — Dialog, telefonda — pastdan chiquvchi Drawer"
        footer={
          <>
            <Button variant="outline" onClick={close}>
              {t("common.cancel")}
            </Button>
            <Button onClick={close}>{t("common.save")}</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field className="gap-2">
            <FieldLabel htmlFor="ds-name">{t("common.name")}</FieldLabel>
            <Input id="ds-name" placeholder="Ilmora" />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="ds-note">{t("common.note")}</FieldLabel>
            <Textarea id="ds-note" rows={3} />
          </Field>
        </div>
      </ResponsiveModal>
    ));

  const openPanel = () =>
    overlay.open(({ open, close }) => (
      <SidePanel
        open={open}
        onOpenChange={(v) => !v && close()}
        title="SidePanel"
        description="md+ — o'ngdan Sheet, telefonda — 92% balandlikdagi Drawer"
        footer={<Button onClick={close}>{t("common.close")}</Button>}
      >
        <InfoList
          columns={2}
          items={Array.from({ length: 10 }, (_, i) => ({
            label: `Label ${i + 1}`,
            value: `Value ${i + 1}`,
          }))}
        />
      </SidePanel>
    ));

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("settingsPage.designSystem.title")}
        description={t("settingsPage.designSystem.description")}
      />

      <SectionCard
        icon={PaletteIcon}
        title="Tokens"
        description="src/styles/theme/tokens.css — xom rang yozilmaydi"
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
          {TOKENS.map(([name, cls]) => (
            <div key={name} className="space-y-1.5">
              <div className={`h-12 rounded-lg ${cls}`} />
              <p className="truncate font-mono text-[0.6875rem] text-muted-foreground">{name}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SectionCard icon={TypeIcon} title="Typography">
          <div className="space-y-3">
            <p className="text-2xl font-semibold tracking-tight">Sahifa sarlavhasi · text-2xl</p>
            <p className="text-sm font-semibold">Blok sarlavhasi · text-sm font-semibold</p>
            <p className="text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums">
              12 480 500
            </p>
            <p className="text-sm">
              Asosiy matn — text-sm. Golos Text, lotin va kirill: Ўзбекистон.
            </p>
            <p className="text-xs text-muted-foreground">Izoh · text-xs text-muted-foreground</p>
            <p className="text-sm">
              <Money value={1250000} /> · <Money value={-35000} signed /> · <Kbd>Ctrl</Kbd>{" "}
              <Kbd>K</Kbd>
            </p>
          </div>
        </SectionCard>

        <SectionCard icon={SquareStackIcon} title="Button">
          <div className="space-y-4">
            <Demo label="variant">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </Demo>
            <Demo label="size + icon + state">
              <Button size="sm">
                <PlusIcon /> Small
              </Button>
              <Button size="lg">Large</Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Bell">
                    <BellIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tooltip</TooltipContent>
              </Tooltip>
              <Button disabled>
                <Spinner /> Loading
              </Button>
            </Demo>
          </div>
        </SectionCard>

        <SectionCard icon={LayersIcon} title="Badge · StatusBadge · TrendBadge · IconBox">
          <div className="space-y-4">
            <Demo label="Badge variant">
              {(
                [
                  "default",
                  "secondary",
                  "outline",
                  "brand",
                  "success",
                  "warning",
                  "info",
                  "danger",
                  "muted",
                ] as const
              ).map((v) => (
                <Badge key={v} variant={v}>
                  {v}
                </Badge>
              ))}
            </Demo>
            <Demo label="StatusBadge">
              {STATUSES.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </Demo>
            <Demo label="TrendBadge">
              <TrendBadge value={0.124} />
              <TrendBadge value={-0.05} />
              <TrendBadge value={-0.08} inverse />
            </Demo>
            <Demo label="IconBox tone">
              {TONES.map((tone) => (
                <IconBox key={tone} icon={PackageIcon} tone={tone} />
              ))}
            </Demo>
            <Demo label="UserAvatar">
              {["Abduvoris Mo'minov", "Madina Rahimova", "Sardor Yusupov", "Laylo Saidova"].map(
                (n) => (
                  <UserAvatar key={n} name={n} />
                )
              )}
            </Demo>
          </div>
        </SectionCard>

        <SectionCard
          icon={SquareStackIcon}
          title="Overlays"
          description="lib/overlays — overlay.open() va await confirm()"
        >
          <div className="space-y-4">
            <Demo label="modal / drawer">
              <Button variant="outline" onClick={openModal}>
                ResponsiveModal
              </Button>
              <Button variant="outline" onClick={openPanel}>
                SidePanel
              </Button>
            </Demo>
            <Demo label="confirm()">
              <Button
                variant="outline"
                onClick={async () => toast(String(await confirm({ title: "Davom etasizmi?" })))}
              >
                confirm
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  const ok = await confirm({
                    destructive: true,
                    onConfirm: () => new Promise((r) => setTimeout(r, 800)),
                  });
                  if (ok) toast.success(t("products.deleted"));
                }}
              >
                <Trash2Icon /> destructive + async
              </Button>
            </Demo>
            <Demo label="toast">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(t("common.savedSuccessfully"))}
              >
                success
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.error(t("errors.generic.title"))}
              >
                error
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.warning(t("status.lowStock"))}
              >
                warning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.promise(new Promise((r) => setTimeout(r, 1200)), {
                    loading: t("common.loading"),
                    success: t("common.savedSuccessfully"),
                  })
                }
              >
                promise
              </Button>
            </Demo>
          </div>
        </SectionCard>

        <SectionCard
          icon={TypeIcon}
          title="Form controls"
          description="Formalarda — components/shared/form (react-hook-form + zod)"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field className="gap-2">
              <FieldLabel htmlFor="ds-input">Input</FieldLabel>
              <Input id="ds-input" placeholder="Placeholder" />
              <FieldDescription>FieldDescription</FieldDescription>
            </Field>
            <Field className="gap-2" data-invalid>
              <FieldLabel htmlFor="ds-invalid">Invalid</FieldLabel>
              <Input id="ds-invalid" aria-invalid defaultValue="xato" />
              <p className="text-sm text-destructive">{t("validation.required")}</p>
            </Field>
            <Field className="gap-2">
              <FieldLabel>InputGroup</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput placeholder={t("common.search")} />
              </InputGroup>
            </Field>
            <Field className="gap-2">
              <FieldLabel>Select</FieldLabel>
              <Select defaultValue="b">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Variant A</SelectItem>
                  <SelectItem value="b">Variant B</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center gap-2">
              <Checkbox id="ds-check" defaultChecked />
              <Label htmlFor="ds-check">Checkbox</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="ds-switch" defaultChecked />
              <Label htmlFor="ds-switch">Switch</Label>
            </div>
            <RadioGroup defaultValue="1" className="flex gap-4">
              {["1", "2"].map((v) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={`ds-r${v}`} />
                  <Label htmlFor={`ds-r${v}`}>Radio {v}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="space-y-2">
              <Progress value={64} />
              <div className="flex gap-2">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={LayersIcon} title="Tabs · Alert">
          <div className="space-y-4">
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">
                  Barchasi <Badge variant="muted">12</Badge>
                </TabsTrigger>
                <TabsTrigger value="b">Faol</TabsTrigger>
                <TabsTrigger value="c">Arxiv</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="pt-2 text-sm text-muted-foreground">
                TabsContent
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="a">
              <TabsList variant="line">
                <TabsTrigger value="a">Line A</TabsTrigger>
                <TabsTrigger value="b">Line B</TabsTrigger>
              </TabsList>
            </Tabs>
            <Alert>
              <BellIcon />
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>Ma'lumot uchun xabar.</AlertDescription>
            </Alert>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BanknoteIcon}
          label="StatCard"
          value="34,8 mln"
          badge={<TrendBadge value={0.12} />}
          hint="hint"
        />
        <StatCard icon={PackageIcon} tone="success" label="tone=success" value="1 284" />
        <StatCard icon={PackageIcon} tone="warning" label="tone=warning" value="—" loading />
        <StatCard icon={PackageIcon} tone="danger" label="tone=danger" value="12" hint="hint" />
      </div>

      <EmptyState
        icon={InboxIcon}
        title="EmptyState"
        description="Bo'sh ro'yxat, natija yo'q yoki «tez orada» holati."
        action={<Button size="sm">Action</Button>}
      />
    </div>
  );
}
