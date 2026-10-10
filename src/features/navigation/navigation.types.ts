export type SidebarPage = {
  title: string;
  slug: string[];
  href: string;
  order: number;
};

export type SidebarGroup = {
  title: string;
  description?: string;
  /** "module" for a subject of the course, "resource" for course material (plan, assessments). */
  kind: "module" | "resource";
  slug: string[];
  href: string;
  order: number;
  pages: SidebarPage[];
  groups: SidebarGroup[];
};

export type SidebarCourse = {
  title: string;
  slug: string[];
  href: string;
  order: number;
  pages: SidebarPage[];
  groups: SidebarGroup[];
};

export type Crumb = {
  title: string;
  href?: string;
};
