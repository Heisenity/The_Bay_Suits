const phrases = [
  "Design-led residences",
  "24/7 guest care",
  "Flexible corporate stays",
  "Professionally prepared",
  "Canada · United States · India"
];

export function MarqueeBand() {
  const repeated = [...phrases, ...phrases];
  return (
    <div className="relative z-10 overflow-hidden border-y border-ink/10 bg-champagne py-4 text-ink" aria-label="The Bay Suites highlights">
      <div className="marquee-track flex w-max items-center">
        {repeated.map((phrase, index) => (
          <div key={`${phrase}-${index}`} className="flex items-center">
            <span className="whitespace-nowrap px-7 text-[11px] font-bold uppercase tracking-[.18em] md:px-10">{phrase}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
