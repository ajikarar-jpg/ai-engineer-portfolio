type MockFrameProps = {
  label: string;
  children: React.ReactNode;
  decorative?: boolean;
};

export function MockFrame({ label, children, decorative = false }: MockFrameProps) {
  return (
    <figure
      aria-hidden={decorative ? true : undefined}
      className="overflow-hidden rounded-xl border border-line bg-[#0d1016]"
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted">{label}</span>
        <span className="text-[11px] text-muted">Sample</span>
      </figcaption>
      <div className="p-3 sm:p-4">{children}</div>
    </figure>
  );
}
