import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { TransientSimulation } from '@/components/simulations/eee/TransientSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const TransientLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Transient Response Analysis</h1>
        <p className="text-muted-foreground mb-6">Study step response of RC, RL, and RLC circuits with time constant analysis</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Transient Response" />
        <TransientSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox context="Transient response analysis of RC, RL, and RLC circuits" /></div>
      </main>
    </div>
  );
};
export default TransientLab;
