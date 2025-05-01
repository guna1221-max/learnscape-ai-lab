
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function SonometerCard() {
  return (
    <ExperimentCard
      title="Sonometer Experiment"
      description="Explore the principles of standing waves and resonance in vibrating strings"
      imageUrl="/images/experiments/sonometer-setup.jpg"
      category="Physics"
      difficulty="Intermediate"
      duration="25 minutes"
      path="/physics/sonometer"
    />
  );
}
