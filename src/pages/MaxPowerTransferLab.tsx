import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { MaxPowerTransferSimulation } from '@/components/simulations/eee/MaxPowerTransferSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const MaxPowerTransferLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Maximum Power Transfer Theorem</h1>
        <p className="text-muted-foreground mb-6">Determine load resistance for maximum power delivery from a source network</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Max Power Transfer" />
        <MaxPowerTransferSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox experimentContext="Maximum Power Transfer Theorem experiment" /></div>
      </main>
    </div>
  );
};
export default MaxPowerTransferLab;
