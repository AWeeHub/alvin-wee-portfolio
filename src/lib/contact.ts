const WHATSAPP_NUMBER = '639455575654';

export const CONTACT_EMAIL = 'alvin@awee.digital';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/alvinwee';

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(): string {
  return `mailto:${CONTACT_EMAIL}`;
}
