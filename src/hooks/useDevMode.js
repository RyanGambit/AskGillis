export function useDevMode() {
  const params = new URLSearchParams(window.location.search);
  const isDevMode = params.get('devMode') === 'true';
  return { isDevMode };
}
