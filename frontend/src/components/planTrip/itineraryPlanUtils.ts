/** Sort `"Day N"` keys numerically when present */
export function sortDayKeys(dayKeys: string[]): string[] {
  return [...dayKeys].sort((a, b) => {
    const na = /\d+/.exec(a)?.[0];
    const nb = /\d+/.exec(b)?.[0];
    if (na === undefined || nb === undefined) {
      return a.localeCompare(b);
    }
    return Number(na) - Number(nb);
  });
}
