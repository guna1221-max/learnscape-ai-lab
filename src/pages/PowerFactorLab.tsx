import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { PowerFactorSimulation } from '@/components/simulations/eee/PowerFactorSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const PowerFactorLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Power Factor Measurement</h1>
        <p className="text-muted-foreground mb-6">Measure and analyze real, reactive, and apparent power with power triangle visualization</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Power Factor" />
        <PowerFactorSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox experimentContext="Power factor measurement and power triangle analysis" /></div>
      </main>
    </div>
  );
};
export default PowerFactorLab;
