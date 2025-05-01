
import { ExperimentCard } from "./ExperimentCard";

export function NewtonRingsCard() {
  return (
    <ExperimentCard
      title="Newton's Rings"
      description="Explore wave interference patterns with this classic optics experiment"
      imageUrl="/images/experiments/newtons-rings-setup.jpg"
      category="Optics"
      difficulty="Intermediate"
      duration="30-45 min"
      path="/physics/newtons-rings"
    />
  );
}
