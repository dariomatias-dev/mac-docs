// Closed vocabulary of proof/solution techniques a <Resolution> can be
// tagged with. Keep it closed so every tag can later be mapped to its
// technique page and indexed, instead of drifting into free text.
export const RESOLUTION_METHODS = {
  direta: "direta",
  contraposicao: "por contraposição",
  contradicao: "por contradição",
  inducao: "por indução",
  recursao: "por recursão",
  contraexemplo: "por contraexemplo",
} as const;

export type ResolutionMethod = keyof typeof RESOLUTION_METHODS;
