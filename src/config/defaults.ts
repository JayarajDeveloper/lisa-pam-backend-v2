/** Local Docker default — never used as a production fallback. */
export const DEFAULT_DATABASE_URL = 'postgres://lisa:lisa@127.0.0.1:55432/lisa_pam_v2';

export function isLoopbackDatabaseUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === '127.0.0.1' || hostname === 'localhost';
  } catch {
    return false;
  }
}
