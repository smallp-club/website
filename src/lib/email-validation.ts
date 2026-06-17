const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

const DISPOSABLE_DOMAINS = new Set([
  '0-mail.com',
  '10minutemail.com',
  '10minutemail.net',
  '20minutemail.com',
  'anonbox.net',
  'anonymbox.com',
  'discard.email',
  'dispostable.com',
  'fakeinbox.com',
  'getnada.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'inboxbear.com',
  'mailcatch.com',
  'maildrop.cc',
  'mailinator.com',
  'mailinator.net',
  'mailnesia.com',
  'mailsac.com',
  'mintemail.com',
  'mohmal.com',
  'mytemp.email',
  'sharklasers.com',
  'sneakemail.com',
  'spambog.com',
  'spamgourmet.com',
  'tempmail.dev',
  'tempmail.net',
  'tempmailo.com',
  'temp-mail.org',
  'throwawaymail.com',
  'trashmail.com',
  'trashmail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
]);

export function isValidEmail(email: string): boolean {
  if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_REGEX.test(email);
}

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf('@');
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase();
  return DISPOSABLE_DOMAINS.has(domain);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
