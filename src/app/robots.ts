import { MetadataRoute } from "next";

const BASE_URL = "https://ai-tools-site-fznaqbe4q-feng20911-s-projects.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
