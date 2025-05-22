import puppeteer from "puppeteer";
import { scrapeUICCoursesFromSubject } from "./uicCourses";

export async function scrapeUICSubjects() {
  const url = "https://catalog.uic.edu/ucat/course-descriptions/";
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const subjects = await page.$$eval("ul li a", (links) =>
    links
      .map((el) => {
        const title = el.textContent?.trim() || "";
        const href = (el as HTMLAnchorElement).href;
        if (!href.includes("/ucat/courses/")) return null;

        const match = href.match(/\/courses\/([^/]+)\//i);
        const code = match ? match[1].toUpperCase() : title;

        return {
          code,
          title,
          link: href,
        };
      })
      .filter(Boolean)
  );

  await browser.close();
  return subjects;
}

// ✅ This is what was missing:
export async function scrapeUIC() {
  const subjects = await scrapeUICSubjects();
  const allCourses = [];

  for (const subject of subjects) {
    const courses = await scrapeUICCoursesFromSubject(subject.link);
    allCourses.push(...courses);
  }

  return allCourses;
}
