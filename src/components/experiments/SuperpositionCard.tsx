import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function SuperpositionCard() {
  return (
    <ExperimentCard
      title="Superposition Theorem"
      description="Verify superposition theorem in linear networks with multiple voltage sources"
      imageUrl="/images/experiments/superposition-theorem.jpg"
      category="BEEE"
      difficulty="Intermediate"
      duration="40 minutes"
      path="/eee/superposition"
    />
  );
}
