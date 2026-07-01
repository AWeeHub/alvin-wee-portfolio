import { describe, it, expect } from 'vitest';
import { whatsappUrl, mailtoUrl } from './contact';

describe('contact links', () => {
  it('builds a wa.me link with the correct number and no message by default', () => {
    expect(whatsappUrl()).toBe('https://wa.me/639455575654');
  });

  it('builds a wa.me link with a URL-encoded message when provided', () => {
    expect(whatsappUrl('Hi Alvin, interested in a GHL system')).toBe(
      'https://wa.me/639455575654?text=Hi%20Alvin%2C%20interested%20in%20a%20GHL%20system',
    );
  });

  it('builds the mailto link for the public contact email', () => {
    expect(mailtoUrl()).toBe('mailto:weealvin124@gmail.com');
  });
});
