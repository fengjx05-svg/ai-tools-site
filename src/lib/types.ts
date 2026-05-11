export interface ToolFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  rating: number;
  pricing: string;
  url: string;
  tags: string[];
  updated: string;
  image?: string;
}

export interface TutorialFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  updated: string;
  related_tools?: string[];
  related_tutorials?: string[];
}

export interface CompareFrontmatter {
  title: string;
  slug: string;
  tool_a: string;
  tool_b: string;
  description: string;
  comparison_points: string[];
}
