import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";
import { initials } from "@/utils/format";

/** Ism bo'yicha barqaror rang (tus) — har odam o'z rangida, lekin faqat token'lardan */
const TONES = [
  "bg-primary/10 text-primary",
  "bg-success/10 text-success",
  "bg-warning/10 text-warning",
  "bg-info/10 text-info",
  "bg-destructive/10 text-destructive",
] as const;

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function UserAvatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Avatar
      className={cn(
        size === "sm" && "size-7 text-[0.65rem]",
        size === "md" && "size-8 text-xs",
        size === "lg" && "size-12 text-sm",
        className
      )}
    >
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className={cn("font-semibold", TONES[hash(name) % TONES.length])}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
