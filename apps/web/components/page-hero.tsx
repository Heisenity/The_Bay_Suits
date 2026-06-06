export function PageHero({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="grain bg-ink px-5 py-24 text-white md:px-10 md:py-32 lg:px-16">
      <div className="container-wide">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl font-display text-6xl leading-[0.95] md:text-8xl">{title}</h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 md:text-lg">{description}</p>
      </div>
    </section>
  );
}
