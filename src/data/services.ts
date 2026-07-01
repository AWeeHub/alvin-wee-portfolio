import {
  Database,
  Filter,
  LayoutTemplate,
  Globe,
  Zap,
  Settings,
  GitBranch,
  UserPlus,
  Calendar,
  Bot,
  Workflow,
  Mail,
  MessageSquare,
  FileText,
  Users,
  Plug,
  History,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  label: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  { label: 'GoHighLevel CRM', icon: Database },
  { label: 'Sales Funnel Development', icon: Filter },
  { label: 'Landing Page Design', icon: LayoutTemplate },
  { label: 'High-Converting Websites', icon: Globe },
  { label: 'Marketing Automation', icon: Zap },
  { label: 'CRM Setup', icon: Settings },
  { label: 'Pipeline Management', icon: GitBranch },
  { label: 'Lead Capture Systems', icon: UserPlus },
  { label: 'Calendar Booking Systems', icon: Calendar },
  { label: 'AI Automations', icon: Bot },
  { label: 'Workflow Automation', icon: Workflow },
  { label: 'Email Marketing Automation', icon: Mail },
  { label: 'SMS Automation', icon: MessageSquare },
  { label: 'Forms & Surveys', icon: FileText },
  { label: 'Membership Areas', icon: Users },
  { label: 'Integrations', icon: Plug },
  { label: 'Data Migration', icon: History },
  { label: 'Conversion Optimization', icon: TrendingUp },
];
