export function SuggestedPrompts({
  questions,
  onSelect,
}: {
  questions: readonly string[];
  onSelect: (question: string) => void;
}) {
  if (questions.length === 0) return null;
  return (
    <div className="mt-3 flex flex-col gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          className="min-h-11 rounded-xl border border-line px-3 py-2.5 text-left text-[15px] leading-6 transition-colors duration-200 hover:bg-white/[0.04]"
          onClick={() => onSelect(question)}
        >
          {question}
        </button>
      ))}
    </div>
  );
}
