export interface FlowStep {
  label: string;
  image: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'GHL Automation' | 'Web Build';
  problem: string;
  solution: string;
  techStack: string[];
  results?: string;
  liveUrl?: string;
  flow?: FlowStep[];
  images: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'matisse-academy',
    title: 'Matisse Academy',
    category: 'GHL Automation',
    problem:
      'A legal-education client needed a 3-day challenge funnel that could sell a high-ticket trust bundle without a live sales team chasing every lead by hand.',
    solution:
      'Built the full GoHighLevel automation behind the challenge: optin capture, general/VIP admission upsells, application intake, a bridge-sale bundle offer, payment confirmation, and automatic appointment reminders — all running without manual follow-up.',
    techStack: ['GoHighLevel CRM', 'Workflows', 'Funnels', 'Calendars & Payments'],
    results: 'Full 12-stage challenge funnel — opt-in to product delivery, zero manual follow-up.',
    images: [],
    flow: [
      { label: 'Challenge Optin', image: '/work/matisse/optin-page.webp' },
      { label: 'General Admission', image: '/work/matisse/general-admission.webp' },
      { label: 'VIP Admission Upsell', image: '/work/matisse/vip-admission.webp' },
      { label: 'Application Submitted', image: '/work/matisse/application-submitted.webp' },
      { label: 'Trust Bundle Pre-Call', image: '/work/matisse/trust-bundle-pre-call.webp' },
      { label: 'Bridge Sale Purchase', image: '/work/matisse/bridge-sale-purchase.webp' },
      { label: 'Bundle Application Submitted', image: '/work/matisse/bundle-application-submitted.webp' },
      { label: 'Purchase & Confirmation', image: '/work/matisse/purchase-confirmation.webp' },
      { label: 'Payment Fully Paid', image: '/work/matisse/payment-fully-paid.webp' },
      { label: 'Appointment Reminders', image: '/work/matisse/appointment-reminders.webp' },
      { label: 'Consult Tracking Dashboard', image: '/work/matisse/consult-tracking.webp' },
      { label: 'Product Delivery', image: '/work/matisse/product-delivery.webp' },
    ],
  },
  {
    id: 'ev-installer',
    title: 'VOLTLINE — EV Installer',
    category: 'Web Build',
    problem:
      'Residential & commercial EV charger installers need a lead-capture site that qualifies property type before a quote request ever reaches a human.',
    solution:
      'Built a cinematic single-page marketing site with a working residential/commercial toggle and a multi-step lead-capture flow, structured to plug straight into a CRM pipeline.',
    techStack: ['HTML/CSS/JS', 'Vercel', 'CRM-ready lead capture'],
    results: 'Portfolio build — CRM-ready lead capture, deployable as-is.',
    liveUrl: 'https://voltline-ev-installer.vercel.app',
    images: ['/work/ev-installer.webp'],
  },
  {
    id: 'ironhaul-logistics',
    title: 'IronHaul Logistics',
    category: 'Web Build',
    problem:
      'Freight carriers need a site that reads as established and trustworthy, with a fast path from "interested" to "booked."',
    solution:
      'Built a GSAP-animated freight carrier landing page with a booking modal, positioning the client for direct quote requests instead of generic contact-us forms.',
    techStack: ['HTML/CSS/JS', 'GSAP', 'Vercel'],
    results: 'Portfolio build — booking-first landing pattern.',
    liveUrl: 'https://ironhaul-logistics-five.vercel.app',
    images: ['/work/ironhaul-logistics.webp'],
  },
  {
    id: 'avnm-caffe',
    title: 'AVNM Caffè',
    category: 'Web Build',
    problem:
      'A real coffee-shop client needed a site that felt as premium as their product, with a full menu and gallery instead of a static one-pager.',
    solution:
      'Built a Vite + GSAP + Lenis site with scroll-reveals, parallax, and a full modular menu/gallery — real client work, not a demo.',
    techStack: ['Vite', 'GSAP', 'Lenis', 'Vercel'],
    results: 'Live client project.',
    liveUrl: 'https://avnm-caffe.vercel.app',
    images: ['/work/avnm-caffe.webp'],
  },
  {
    id: 'tricia-portfolio',
    title: 'Tricia Claire Navales — VA/EA Portfolio',
    category: 'Web Build',
    problem:
      'A virtual/executive assistant needed a portfolio that reads as editorial and premium, not a generic freelancer template.',
    solution:
      'Built a single-page plum/mauve editorial portfolio site tailored to a VA/EA personal brand.',
    techStack: ['HTML/CSS/JS', 'Vercel'],
    results: 'Live personal-brand project.',
    liveUrl: 'https://tricia-portfolio.vercel.app',
    images: ['/work/tricia-portfolio.webp'],
  },
];
