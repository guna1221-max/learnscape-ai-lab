
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function BHCurveCard() {
  return (
    <ExperimentCard
      title="B-H Curve Experiment"
      description="Explore the relationship between magnetic field intensity and flux density in different materials"
      imageUrl="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000"
      category="Physics"
      difficulty="Intermediate"
      duration="20 minutes"
      path="/physics/bh-curve"
    />
  );
}
