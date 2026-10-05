import { Container } from "@/components/Container";
import { LinkButton } from "@/components/LinkButton";

export default function NotFound() {
  return (
    <Container className="py-32 md:py-40">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-4 max-w-xl text-4xl font-medium tracking-tight md:text-5xl">This page is not here.</h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">The link may be out of date. The work lives on the home page.</p>
      <div className="mt-8">
        <LinkButton href="/">Back home</LinkButton>
      </div>
    </Container>
  );
}
