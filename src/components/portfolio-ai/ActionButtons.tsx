import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AssistantAction } from "@/lib/portfolioAssistantTypes";
import { scrollToSection } from "@/lib/scroll";

export function ActionButtons({
  actions,
  onNavigate,
  onStart,
}: {
  actions: AssistantAction[];
  onNavigate: () => void;
  onStart: () => void;
}) {
  const pathname = usePathname();
  if (actions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => {
        const className =
          "inline-flex min-h-11 items-center rounded-full border border-line px-3.5 text-[15px] leading-6 transition-colors duration-200 hover:bg-white/[0.04]";
        if (action.command === "start-project") {
          return (
            <button key={action.label} type="button" className={className} onClick={onStart}>
              {action.label}
            </button>
          );
        }
        if (!action.href) return null;
        if (action.external || action.href.startsWith("mailto:")) {
          return (
            <a
              key={`${action.href}-${action.label}`}
              href={action.href}
              className={className}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
            >
              {action.label}
            </a>
          );
        }
        return (
          <Link
            key={`${action.href}-${action.label}`}
            href={action.href}
            className={className}
            onClick={(event) => {
              onNavigate();
              if (pathname === "/") scrollToSection(event, action.href!);
            }}
          >
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}
