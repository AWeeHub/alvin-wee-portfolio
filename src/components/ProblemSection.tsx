const COSTS = [
  {
    title: 'Leads go cold',
    detail: 'No system means every lead depends on someone remembering to follow up.',
  },
  {
    title: 'Manual work compounds',
    detail: 'Every repetitive task by hand is time that never goes back into growth.',
  },
  {
    title: 'Booked calls slip away',
    detail: 'A disorganized CRM turns interested buyers into no-shows and ghosts.',
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="bg-bg px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Every day without a system has a cost.
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {COSTS.map((cost) => (
            <div
              key={cost.title}
              className="rounded-2xl border border-white/10 bg-bg-elev p-6 transition hover:border-accent/40"
            >
              <h3 className="font-sans text-lg text-text">{cost.title}</h3>
              <p className="mt-3 font-sans text-sm text-muted">{cost.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
