
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

export function SonometerCard() {
  return (
    <ExperimentCard
      title="Sonometer Experiment"
      description="Determine frequency of AC supply and tension using transverse vibrations of stretched string"
      imageUrl="/images/experiments/sonometer.jpg"
      category="Physics"
      difficulty="Intermediate"
      duration="45 minutes"
      path="/physics/sonometer"
    />
  );
}
