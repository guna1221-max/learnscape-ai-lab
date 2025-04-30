
import { ExperimentCard } from "./ExperimentCard";

export function NewtonRingsCard() {
  return (
    <ExperimentCard
      title="Newton's Rings"
      description="Explore wave interference patterns with this classic optics experiment"
      imageUrl="https://images.unsplash.com/photo-1608108707926-8f14abd56336?q=80&w=1000"
      category="Optics"
      difficulty="Intermediate"
      duration="30-45 min"
      path="/physics/newtons-rings"
    />
  );
}
