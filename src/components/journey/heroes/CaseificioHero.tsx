export function CaseificioHero() {
  return (
    <div className="hero-canvas-frame hero-canvas-frame--caseificio" aria-hidden="true">
      <img
        src="/images/caseificio/caseificio-hero-caciocavalli.webp"
        alt="Caciocavalli e formaggi stagionati del Caseificio della Masseria Don Gianvito"
        className="h-full w-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(42, 24, 14, 0.56) 0%, rgba(42, 24, 14, 0.34) 48%, rgba(42, 24, 14, 0.72) 100%)",
        }}
      />
    </div>
  );
}
