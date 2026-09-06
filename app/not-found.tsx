import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[80vh] flex-col items-start justify-center pt-20">
      <span className="eyebrow">404</span>
      <h1 className="display-title mt-6">That page slipped away.</h1>
      <p className="muted-copy mt-6">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <ButtonLink href="/" className="mt-8">
        Return home
      </ButtonLink>
    </main>
  );
}
