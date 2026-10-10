import { MATERIAL_CONTRIBUTORS } from "../data/material-contributors";
import { MONITORS } from "../data/monitors";

import type { MaterialContributor } from "../contributors.types";

export type TeamRole = "Monitoria" | "Material";

export type TeamMember = {
  name: string;
  githubUrl?: string;
  roles: TeamRole[];
};

/**
 * Monitors and material contributors as one list of people, each with every
 * role they hold, so someone who does both appears once.
 */
export function getTeam(
  monitors: MaterialContributor[] = MONITORS,
  material: MaterialContributor[] = MATERIAL_CONTRIBUTORS,
): TeamMember[] {
  const members = new Map<string, TeamMember>();

  const add = (people: MaterialContributor[], role: TeamRole) => {
    for (const person of people) {
      const key = person.githubUrl?.replace(/\/+$/, "").toLowerCase() ?? person.name;
      const member = members.get(key) ?? {
        name: person.name,
        githubUrl: person.githubUrl,
        roles: [],
      };
      if (!member.roles.includes(role)) member.roles.push(role);
      members.set(key, member);
    }
  };

  add(monitors, "Monitoria");
  add(material, "Material");
  return [...members.values()];
}

/** "@user" from a GitHub profile URL. */
export function githubHandle(githubUrl?: string): string | undefined {
  const username = githubUrl?.replace(/\/+$/, "").split("/").pop();
  return username ? `@${username}` : undefined;
}
