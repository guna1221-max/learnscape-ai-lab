import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { LissajousSimulation } from '@/components/simulations/eee/LissajousSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const LissajousLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Lissajous Figures (CRO)</h1>
        <p className="text-muted-foreground mb-6">Generate and analyze Lissajous patterns for frequency comparison and phase measurement</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Lissajous Figures" />
        <LissajousSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox context="Lissajous figures using CRO for frequency and phase measurement" /></div>
      </main>
    </div>
  );
};
export default LissajousLab;
