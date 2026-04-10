import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { NortonSimulation } from '@/components/simulations/eee/NortonSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const NortonLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Norton's Theorem</h1>
        <p className="text-muted-foreground mb-6">Find Norton equivalent circuit with current source and parallel resistance</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Norton's Theorem" />
        <NortonSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox context="Norton's Theorem experiment" /></div>
      </main>
    </div>
  );
};
export default NortonLab;
