import { Filter, LayoutTemplate, Workflow, Settings, type LucideIcon } from 'lucide-react';

export interface Service {
  label: string;
  desc: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    label: 'Sales Funnel Development',
    desc: 'Pages that qualify leads before you ever talk to them.',
    icon: Filter,
  },
  {
    label: 'Landing Page Design',
    desc: 'Designed to convert, not just to look expensive.',
    icon: LayoutTemplate,
  },
  {
    label: 'Workflow Automation',
    desc: 'Follow-ups, reminders, and tags that fire themselves.',
    icon: Workflow,
  },
  {
    label: 'CRM Setup',
    desc: 'Every lead visible: stage, source, next action.',
    icon: Settings,
  },
];
