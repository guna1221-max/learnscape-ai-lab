import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function RLCCircuitCard() {
  return (
    <ExperimentCard
      title="RLC Circuit"
      description="Study series and parallel RLC circuits, impedance, resonance, and frequency response"
      imageUrl="/images/experiments/rlc-circuit.jpg"
      category="BEEE"
      difficulty="Intermediate"
      duration="45 minutes"
      path="/eee/rlc-circuit"
    />
  );
}
