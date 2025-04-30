
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function SonometerCard() {
  return (
    <ExperimentCard
      title="Sonometer Experiment"
      description="Explore the principles of standing waves and resonance in vibrating strings"
      imageUrl="https://images.unsplash.com/photo-1575574238095-db88d347cf13?q=80&w=1000"
      category="Physics"
      difficulty="Intermediate"
      duration="25 minutes"
      path="/physics/sonometer"
    />
  );
}
