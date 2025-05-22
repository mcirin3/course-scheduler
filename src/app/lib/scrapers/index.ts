import { scrapeUIC } from "./uic";

export const universityScrapers: Record<string, () => Promise<any>> = {
  uic: scrapeUIC,
};

export function getScraper(university: string) {
  return universityScrapers[university.toLowerCase()];
}
