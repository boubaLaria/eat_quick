import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const menuDir = path.join(process.cwd(), "content/menu-offer");

export type MenuItem = {
  slug: string;
  title: string;
  category: string;
  ingredients: string[];
  calories: number;
  price: number;
  imageSrc: string;
  contentHtml: string;
};

export function getAllMenuItems(): MenuItem[] {
  const files = fs.readdirSync(menuDir).filter((f) => f.endsWith(".md"));
  return files
    .map((filename) => {
      const filePath = path.join(menuDir, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug as string,
        title: data.title as string,
        category: (data.category as string) ?? "other",
        ingredients: (data.ingredients as string[]) ?? [],
        calories: (data.calories as number) ?? 0,
        price: (data.price as number) ?? 0,
        imageSrc: (data.imageSrc as string) ?? "no-image.png",
        contentHtml: "",
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getMenuItemsByCategory(category: string): MenuItem[] {
  return getAllMenuItems().filter((item) => item.category === category);
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const files = fs.readdirSync(menuDir).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const filePath = path.join(menuDir, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      const processed = await remark().use(html).process(content);
      return {
        slug: data.slug as string,
        title: data.title as string,
        category: (data.category as string) ?? "other",
        ingredients: (data.ingredients as string[]) ?? [],
        calories: (data.calories as number) ?? 0,
        price: (data.price as number) ?? 0,
        imageSrc: (data.imageSrc as string) ?? "no-image.png",
        contentHtml: processed.toString(),
      };
    }
  }
  return null;
}

export function getAllCategories(): string[] {
  const items = getAllMenuItems();
  return [...new Set(items.map((i) => i.category))];
}
