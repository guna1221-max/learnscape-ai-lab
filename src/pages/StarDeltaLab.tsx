import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { StarDeltaSimulation } from '@/components/simulations/eee/StarDeltaSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const StarDeltaLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Star-Delta Transformation</h1>
        <p className="text-muted-foreground mb-6">Convert between star (Y) and delta (Δ) resistor network configurations</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Star-Delta Transform" />
        <StarDeltaSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox context="Star-Delta (Y-Δ) transformation experiment" /></div>
      </main>
    </div>
  );
};
export default StarDeltaLab;
