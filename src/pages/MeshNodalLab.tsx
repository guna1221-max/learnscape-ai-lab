import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { MeshNodalSimulation } from '@/components/simulations/eee/MeshNodalSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';

const MeshNodalLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Mesh & Nodal Analysis</h1>
        <p className="text-muted-foreground mb-6">Solve DC circuits using mesh current and node voltage methods</p>
        <SimulationController isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} title="Mesh & Nodal Analysis" />
        <MeshNodalSimulation isRunning={isRunning} />
        <div className="mt-8"><AiChatbox context="Mesh and Nodal analysis methods for circuit solving" /></div>
      </main>
    </div>
  );
};
export default MeshNodalLab;
