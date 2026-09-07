import dynamic from "next/dynamic";

import { Alternative, Alternatives } from "./components/alternatives";
import { Badge } from "./components/badge";
import { Callout } from "./components/callout";
import { Collapsible } from "./components/collapsible";
import { Answer, Exercise } from "./components/exercise";
import { Marker } from "./components/marker";
import { Proof } from "./components/proof";
import { Question } from "./components/question";
import { Option } from "./components/quiz";
import { Resolution } from "./components/resolution";
import { Step } from "./components/step-by-step";
import { YouTube } from "./components/youtube";

// The interactive calculators, exercises, quiz, and diagrams pull in KaTeX
// and their own computation logic; measuring the build showed all of them
// (plus KaTeX itself) landing in one ~324KB chunk shipped to *every* docs
// page, including plain-prose ones that render none of them. next/dynamic
// gives each its own chunk, fetched only by a page that actually renders it.
const BooleanMatrixCalculator = dynamic(() =>
  import("./components/boolean-matrix-calculator").then((m) => m.BooleanMatrixCalculator),
);
const BooleanMatrixExercise = dynamic(() =>
  import("./components/boolean-matrix-exercise").then((m) => m.BooleanMatrixExercise),
);
const MatrixCalculator = dynamic(() =>
  import("./components/matrix-calculator").then((m) => m.MatrixCalculator),
);
const MatrixExercise = dynamic(() =>
  import("./components/matrix-exercise").then((m) => m.MatrixExercise),
);
const PixelGrid = dynamic(() => import("./components/pixel-grid").then((m) => m.PixelGrid));
const Quiz = dynamic(() => import("./components/quiz").then((m) => m.Quiz));
const RegionDiagram = dynamic(() =>
  import("./components/region-diagram").then((m) => m.RegionDiagram),
);
const SetCalculator = dynamic(() =>
  import("./components/set-calculator").then((m) => m.SetCalculator),
);
const StepByStep = dynamic(() => import("./components/step-by-step").then((m) => m.StepByStep));

export const mdxComponents = {
  Callout,
  Collapsible,
  Exercise,
  Answer,
  Marker,
  Quiz,
  Option,
  Alternatives,
  Alternative,
  Badge,
  PixelGrid,
  Proof,
  Question,
  RegionDiagram,
  Resolution,
  StepByStep,
  Step,
  YouTube,
  SetCalculator,
  MatrixCalculator,
  BooleanMatrixCalculator,
  MatrixExercise,
  BooleanMatrixExercise,
};
