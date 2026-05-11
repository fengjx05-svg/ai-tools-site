import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  ToolFrontmatter,
  TutorialFrontmatter,
  CompareFrontmatter,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

function readMdxFile<T>(
  subdir: string,
  slug: string
): { frontmatter: T; content: string } | null {
  const filePath = path.join(CONTENT_DIR, subdir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as T, content };
}

function readAllMdxFiles<T>(subdir: string): { frontmatter: T; content: string }[] {
  const dirPath = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(dirPath, f), "utf-8");
      const { data, content } = matter(raw);
      return { frontmatter: data as T, content };
    });
}

export function getTool(slug: string) {
  return readMdxFile<ToolFrontmatter>("tools", slug);
}

export function getAllTools() {
  return readAllMdxFiles<ToolFrontmatter>("tools");
}

export function getTutorial(slug: string) {
  return readMdxFile<TutorialFrontmatter>("tutorials", slug);
}

export function getAllTutorials() {
  return readAllMdxFiles<TutorialFrontmatter>("tutorials");
}

export function getCompare(slug: string) {
  return readMdxFile<CompareFrontmatter>("compare", slug);
}

export function getAllCompares() {
  return readAllMdxFiles<CompareFrontmatter>("compare");
}
