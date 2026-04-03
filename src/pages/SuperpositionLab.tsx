import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { SuperpositionSimulation } from '@/components/simulations/eee/SuperpositionSimulation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Book, ListChecks, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuperpositionLab = () => {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Superposition Theorem Experiment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SimulationController
              type="physics"
              title="Superposition Theorem Verification"
              description="Verify superposition theorem in a linear network with multiple sources"
              simulationType="superposition"
              isRunning={isRunning}
              onToggle={() => setIsRunning(!isRunning)}
              onReset={() => setIsRunning(false)}
            >
              <SuperpositionSimulation isRunning={isRunning} />
            </SimulationController>
          </div>

          <div>
            <Tabs defaultValue="theory">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
              </TabsList>
              <TabsContent value="theory" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><Book className="h-4 w-4" /> Superposition Theorem</h3>
                <p className="text-sm">In a linear network with multiple independent sources, the response in any element equals the algebraic sum of responses caused by each source acting alone, with all other sources deactivated.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Voltage sources</strong> → replaced by short circuits</p>
                  <p><strong>Current sources</strong> → replaced by open circuits</p>
                  <p><strong>I_total = I₁ + I₂ + ... + Iₙ</strong></p>
                </div>
              </TabsContent>
              <TabsContent value="procedure" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><ListChecks className="h-4 w-4" /> Procedure</h3>
                <ol className="text-sm list-decimal pl-5 space-y-2">
                  <li>Set up the circuit with two voltage sources</li>
                  <li>Step 1: Keep V₁ active, short V₂, measure currents</li>
                  <li>Step 2: Keep V₂ active, short V₁, measure currents</li>
                  <li>Step 3: Add the individual contributions algebraically</li>
                  <li>Compare with both sources active simultaneously</li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperpositionLab;
