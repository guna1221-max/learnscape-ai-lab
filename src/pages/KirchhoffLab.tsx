import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { KirchhoffSimulation } from '@/components/simulations/eee/KirchhoffSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const KirchhoffLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Kirchhoff's Laws (KVL & KCL)</h1>
        <p className="text-muted-foreground mb-6">Verify Kirchhoff's Voltage Law and Current Law in multi-loop DC circuits</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="KVL/KCL Verification" />
        <KirchhoffSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox experimentContext="Kirchhoff's Voltage Law and Current Law verification experiment" /></div>
      </main>
    </div>
  );
};
export default KirchhoffLab;
