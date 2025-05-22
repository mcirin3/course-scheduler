import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrapes individual UIC subject page (like CS, MATH, etc.)
 * @param url Full course subject page (e.g., https://catalog.uic.edu/ucat/course-descriptions/cs/)
 */
export async function scrapeUICCoursesFromSubject(url: string) {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  const courses: {
    code: string;
    title: string;
    hours: string;
    description: string;
  }[] = [];

  $(".courseblock").each((_, el) => {
    const titleText = $(el).find(".courseblocktitle").text().trim();
    const description = $(el).find(".courseblockdesc").text().trim();

    // Example titleText:
    // CS 111. Program Design I. 4 hours.
    const parts = titleText.split(".");
    const codeAndName = parts[0].trim();        // CS 111
    const rest = parts.slice(1).join(".").trim(); // Program Design I. 4 hours.

    const [code, ...nameParts] = codeAndName.split(" ");
    const title = nameParts.join(" ") + ". " + rest;

    const hoursMatch = rest.match(/(\d+)\s+hour/);
    const hours = hoursMatch ? hoursMatch[1] : "";

    courses.push({
      code: codeAndName,
      title,
      hours,
      description,
    });
  });

  return courses;
}
