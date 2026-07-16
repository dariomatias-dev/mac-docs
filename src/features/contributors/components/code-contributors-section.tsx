import { Code2 } from "lucide-react";

import { ContributorCard } from "./contributor-card";
import { ContributorSection } from "./contributor-section";
import { getCodeContributors } from "../lib/get-code-contributors";

export async function CodeContributorsSection() {
  const codeContributors = await getCodeContributors();

  return (
    <ContributorSection
      icon={Code2}
      title="Código"
      description="Contribuidores do repositório no GitHub, por número de commits."
      emptyMessage="Não foi possível carregar os contribuidores do GitHub."
      hasItems={codeContributors.length > 0}
      className="pb-24"
    >
      {codeContributors.map((contributor) => (
        <ContributorCard
          key={contributor.login}
          name={contributor.login}
          subtitle={`${contributor.contributions} commit${contributor.contributions === 1 ? "" : "s"}`}
          href={contributor.htmlUrl}
          avatarUrl={contributor.avatarUrl}
        />
      ))}
    </ContributorSection>
  );
}
