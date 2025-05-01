
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function BHCurveCard() {
  return (
    <ExperimentCard
      title="B-H Curve & Hysteresis"
      description="Plot B-H curve and determine hysteresis loss using a digital storage oscilloscope and function generator"
      imageUrl="/images/experiments/bh-curve.jpg"
      category="BEEE"
      difficulty="Intermediate"
      duration="50 minutes"
      path="/physics/bh-curve"
    />
  );
}
