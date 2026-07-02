import { Filter, LayoutTemplate, Workflow, Settings, type LucideIcon } from 'lucide-react';

export interface Service {
  label: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  { label: 'Sales Funnel Development', icon: Filter },
  { label: 'Landing Page Design', icon: LayoutTemplate },
  { label: 'Workflow Automation', icon: Workflow },
  { label: 'CRM Setup', icon: Settings },
];
