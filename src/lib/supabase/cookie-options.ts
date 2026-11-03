/**
 * Auth-Cookies für JavaScript unlesbar (Security-Audit M4). Der Browser-Client
 * von Supabase wird nicht genutzt, alles läuft serverseitig, HttpOnly kostet
 * also nichts. `secure` nur in Produktion, sonst klappt der Login über
 * http im WLAN-Test nicht.
 */
export const supabaseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
