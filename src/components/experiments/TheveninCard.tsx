import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function TheveninCard() {
  return (
    <ExperimentCard
      title="Thevenin's Theorem"
      description="Verify Thevenin's theorem and find equivalent circuit with maximum power transfer"
      imageUrl="/images/experiments/thevenin-theorem.jpg"
      category="BEEE"
      difficulty="Intermediate"
      duration="40 minutes"
      path="/eee/thevenin"
    />
  );
}
