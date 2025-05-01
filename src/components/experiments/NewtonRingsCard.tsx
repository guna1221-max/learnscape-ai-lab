
import { ExperimentCard } from "./ExperimentCard";

export function NewtonRingsCard() {
  return (
    <ExperimentCard
      title="Newton's Rings"
      description="Determine the wavelength of sodium light and radius of curvature of plano-convex lens"
      imageUrl="/images/experiments/newtons-rings.jpg"
      category="Physics"
      difficulty="Intermediate"
      duration="45 min"
      path="/physics/newtons-rings"
    />
  );
}
