
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function BHCurveCard() {
  return (
    <ExperimentCard
      title="B-H Curve & Hysteresis"
      description="Explore magnetic field intensity, flux density, and ferromagnetic hysteresis effects"
      imageUrl="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000"
      category="Physics"
      difficulty="Intermediate"
      duration="25 minutes"
      path="/physics/bh-curve"
    />
  );
}
