import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">This page is not in the workspace.</h1>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        Back to overview
      </Link>
    </div>
  );
}
