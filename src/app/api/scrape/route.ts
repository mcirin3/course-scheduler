import { getScraper } from "../../lib/scrapers";
import { scrapeUICCoursesFromSubject } from "../../lib/scrapers/uicCourses"; // ✅ Direct access to subject scraper
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const university = searchParams.get("university");
  const subject = searchParams.get("subject"); // 👈 support subject param

  if (!university) {
    return NextResponse.json({ error: "Missing university" }, { status: 400 });
  }

  // 📍 Handle subject-specific scraping
  if (university.toLowerCase() === "uic" && subject) {
    const url = `https://catalog.uic.edu/ucat/course-descriptions/${subject.toLowerCase()}/`;
    try {
      const data = await scrapeUICCoursesFromSubject(url);
      return NextResponse.json(data);
    } catch (err: any) {
      console.error(err.message);
      return NextResponse.json({ error: "Subject scraping failed" }, { status: 500 });
    }
  }

  // 🔁 Fall back to full-university scraper
  const scraper = getScraper(university.toLowerCase());

  if (!scraper) {
    return NextResponse.json({ error: `No scraper for "${university}"` }, { status: 404 });
  }

  try {
    const data = await scraper();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
