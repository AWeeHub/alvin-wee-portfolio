import {
  Filter,
  LayoutTemplate,
  Workflow,
  Settings,
  PenTool,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  label: string;
  desc: string;
  icon: LucideIcon;
  /**
   * What the service actually is, in one breath — the thing a client wants to
   * know before they read a list.
   */
  summary: string;
  /**
   * What gets delivered. Four lines, each short enough to land on one or two
   * rows in the detail pane: the pane lives inside a pinned panel, and a panel
   * taller than the viewport slides its own top out of view.
   */
  includes: string[];
  /** The line they are actually buying. */
  outcome: string;
}

/**
 * Deliberately client-agnostic. This is the offer, not the portfolio: naming a
 * past project here makes the service read as a one-off rather than as something
 * that can be bought. The work that proves it lives in Featured Work.
 */
export const services: Service[] = [
  {
    label: 'Sales Funnel Development',
    desc: 'Pages that qualify leads before you ever talk to them.',
    icon: Filter,
    summary:
      'The whole path from stranger to paying customer, built as one connected system instead of pages that hope someone calls.',
    includes: [
      'The offer and the path mapped before anything is built',
      'Opt-in, sales page, upsell, order form, thank-you',
      'Payments, order bumps and confirmations wired in',
      'Tracking at every step, so the leak is visible',
    ],
    outcome: 'A funnel that qualifies and sells on its own.',
  },
  {
    label: 'Landing Page Design',
    desc: 'Designed to convert, not just to look expensive.',
    icon: LayoutTemplate,
    summary:
      'One page with one job. Everything on it either moves someone toward the decision, or gets cut.',
    includes: [
      'One page, one decision — no competing buttons',
      'Layout and copy built around the conversion',
      'Fast on a phone, wired into your CRM from day one',
      'Built to be tested, not rebuilt every quarter',
    ],
    outcome: 'A page that earns the click instead of decorating it.',
  },
  {
    label: 'Workflow Automation',
    desc: 'Follow-ups, reminders, and tags that fire themselves.',
    icon: Workflow,
    summary:
      'Follow-up stops depending on someone remembering. The system runs it instead — every time, at any hour.',
    includes: [
      'Follow-up that fires on behaviour, not on mood',
      'Tags, stages and alerts that update themselves',
      'Reminders, confirmations, no-show recovery',
      'The awkward cases: refunds, duplicates, silence',
    ],
    outcome: 'Nothing gets chased by hand, and nothing goes cold.',
  },
  {
    label: 'CRM Setup',
    desc: 'Every lead visible: stage, source, next action.',
    icon: Settings,
    summary:
      'A CRM shaped like the way you actually sell — not a default template you spend a year working around.',
    includes: [
      'Pipelines that mirror your real sales process',
      'Every lead tagged by source, stage and next action',
      'Dashboards you can read in ten seconds',
      'Your team trained, so it survives the handover',
    ],
    outcome: 'You always know where the money is, and what happens next.',
  },
  {
    label: 'Web Design',
    desc: 'The interface your brand is judged by, built to hold up.',
    icon: PenTool,
    summary:
      'The site people judge you by before they ever speak to you. Built to survive a close look, and to send every visitor somewhere.',
    includes: [
      'Design that holds up when it is looked at closely',
      'Loads fast, behaves on a phone',
      'A clear next action on every screen, feeding the CRM',
      'Deployed, measured and handed over',
    ],
    outcome: 'A site that makes the business look worth hiring.',
  },
];
