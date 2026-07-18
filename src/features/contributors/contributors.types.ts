export type CodeContributor = {
  login: string;
  htmlUrl: string;
  avatarUrl: string;
  contributions: number;
};

// Shared shape for monitors and material contributors: hand-curated people
// whose contribution isn't tied to a git commit.
export type MaterialContributor = {
  name: string;
  role: string;
  githubUrl?: string;
};
