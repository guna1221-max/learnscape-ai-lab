import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function TransformerCard() {
  return (
    <ExperimentCard
      title="Transformer OC & SC Tests"
      description="Determine transformer equivalent circuit parameters using open and short circuit tests"
      imageUrl="/images/experiments/transformer-test.jpg"
      category="BEEE"
      difficulty="Advanced"
      duration="50 minutes"
      path="/eee/transformer"
    />
  );
}
