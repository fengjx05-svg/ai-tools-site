import { MetadataRoute } from "next";
import { getAllTools, getAllTutorials, getAllCompares } from "@/lib/content";

const BASE_URL = "https://ai-tools-site-fznaqbe4q-feng20911-s-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/tutorials`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.3 },
  ];

  const toolPages = getAllTools().map(({ frontmatter }) => ({
    url: `${BASE_URL}/tools/${frontmatter.slug}`,
    lastModified: new Date(frontmatter.updated),
    priority: 0.8,
  }));

  const tutorialPages = getAllTutorials().map(({ frontmatter }) => ({
    url: `${BASE_URL}/tutorials/${frontmatter.slug}`,
    lastModified: new Date(frontmatter.updated),
    priority: 0.8,
  }));

  const comparePages = getAllCompares().map(({ frontmatter }) => ({
    url: `${BASE_URL}/compare/${frontmatter.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...tutorialPages, ...comparePages];
}
