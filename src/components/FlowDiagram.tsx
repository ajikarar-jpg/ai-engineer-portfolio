import { ArrowDown, ArrowRight } from "lucide-react";
import type { FlowStep } from "@/lib/projects";

type FlowDiagramProps = {
  steps: readonly FlowStep[];
};

export function FlowDiagram({ steps }: FlowDiagramProps) {
  return (
    <ol className="mt-8 flex flex-col gap-3 xl:flex-row xl:items-stretch">
      {steps.map((step, index) => (
        <li key={step.title} className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-stretch">
          <article className="flex-1 border border-line p-4 md:p-5">
            <p className="font-mono text-[11px] text-muted">0{index + 1}</p>
            <h3 className="mt-3 text-base font-medium tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
          </article>
          {index < steps.length - 1 ? (
            <div className="flex items-center justify-center text-muted xl:px-0.5" aria-hidden>
              <ArrowDown className="h-4 w-4 xl:hidden" />
              <ArrowRight className="hidden h-4 w-4 xl:block" />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
