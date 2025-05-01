
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function BHCurveCard() {
  return (
    <ExperimentCard
      title="B-H Curve & Hysteresis"
      description="Use virtual magnetic laboratory equipment to study ferromagnetic hysteresis effects"
      imageUrl="/images/experiments/bh-curve-setup.jpg"
      category="Physics"
      difficulty="Intermediate"
      duration="25 minutes"
      path="/physics/bh-curve"
    />
  );
}
