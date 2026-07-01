export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg px-6 py-10 text-center">
      <p className="font-sans text-sm text-text">Alvin Wee</p>
      <p className="mt-1 font-mono text-xs text-muted">
        GoHighLevel Systems Builder — funnels, CRM, automation, and design.
      </p>
      <p className="mt-4 font-mono text-xs text-muted">
        © {new Date().getFullYear()} Alvin Wee. All rights reserved.
      </p>
    </footer>
  );
}
