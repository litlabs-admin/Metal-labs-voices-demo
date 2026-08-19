import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

interface EyebrowProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  children: ReactNode;
  asPill?: boolean;
  /**
   * "dark" is the on-brand-blue form. The light pill bakes in a tan border and
   * ink text, neither of which survives on navy. Defaults to "light".
   */
  theme?: "light" | "dark";
}

// white/xx rather than brand-* at opacity on purpose — see the note in
// Button.tsx: the brand tokens are var()-backed hex and compile to nothing under
// an /opacity modifier.
const pillTheme = {
  light:
    "border-border bg-surface/80 text-ink-muted shadow-[0_1px_2px_rgba(17,17,17,0.04)]",
  dark: "border-white/12 bg-white/[0.04] text-white/70 backdrop-blur-sm",
};

export function Eyebrow({
  icon,
  children,
  asPill = false,
  theme = "light",
  className,
  ...props
}: EyebrowProps) {
  if (asPill) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
          "text-[12px] font-medium tracking-[0.04em]",
          pillTheme[theme],
          className,
        )}
        {...props}
      >
        {icon && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/90 text-accent-ink">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div className={cn("eyebrow inline-flex items-center gap-2", className)} {...props}>
      {icon && <span className="text-ink-muted">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
