import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { WheatstoneSimulation } from '@/components/simulations/eee/WheatstoneSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const WheatstoneLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Wheatstone Bridge</h1>
        <p className="text-muted-foreground mb-6">Measure unknown resistance using balanced bridge principle</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Wheatstone Bridge" />
        <WheatstoneSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox context="Wheatstone Bridge experiment for resistance measurement" /></div>
      </main>
    </div>
  );
};
export default WheatstoneLab;
