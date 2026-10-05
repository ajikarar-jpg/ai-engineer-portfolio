"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { scrollToSection } from "@/lib/scroll";

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
};

const variants = {
  primary: "cta-primary",
  secondary: "cta-secondary",
};

export function LinkButton({ href, children, variant = "primary", className, onClick }: LinkButtonProps) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition duration-200",
    variants[variant],
    className,
  );

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    scrollToSection(event, href);
  };

  if (href.startsWith("http")) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={handleClick}>
      {children}
    </Link>
  );
}
