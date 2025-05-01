
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function TorsionalPendulumCard() {
  return (
    <ExperimentCard
      title="Torsional Pendulum"
      description="Explore rotational motion and oscillations with a torsional pendulum system and analyze the factors affecting its period."
      imageUrl="/images/experiments/torsional-pendulum-setup.jpg"
      category="Physics"
      difficulty="Intermediate"
      duration="20 minutes"
      path="/physics/torsional-pendulum"
    />
  );
}
