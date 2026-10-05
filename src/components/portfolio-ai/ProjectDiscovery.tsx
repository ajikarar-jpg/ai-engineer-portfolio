import type { AssistantLanguage, ConversationStage } from "@/lib/portfolioAssistantTypes";
import { stageCopy } from "@/lib/portfolio/projectDiscovery";

export function ProjectDiscovery({
  stage,
  language,
}: {
  stage: ConversationStage;
  language: AssistantLanguage;
}) {
  const copy = stageCopy(stage, language);
  if (!copy) return null;
  return (
    <div className="border-b border-line px-4 py-2.5">
      <p className="font-mono text-[13px] leading-5 tracking-[0.16em] text-muted uppercase">{copy.kicker}</p>
      <p className="mt-1 text-[15px] leading-6 text-foreground">{copy.line}</p>
    </div>
  );
}
