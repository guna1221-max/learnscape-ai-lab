import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { RLCCircuitSimulation } from '@/components/simulations/eee/RLCCircuitSimulation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Book, Lightbulb, ListChecks, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RLCCircuitLab = () => {
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
            <Zap className="h-6 w-6 text-primary" />
            RLC Circuit Experiment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SimulationController
              type="physics"
              title="RLC Series & Parallel Circuit"
              description="Study impedance, resonance, and frequency response of RLC circuits"
              simulationType="rlc"
              isRunning={isRunning}
              onToggle={() => setIsRunning(!isRunning)}
              onReset={() => setIsRunning(false)}
            >
              <RLCCircuitSimulation isRunning={isRunning} />
            </SimulationController>
          </div>

          <div>
            <Tabs defaultValue="theory">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
              </TabsList>
              <TabsContent value="theory" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><Book className="h-4 w-4" /> RLC Circuit Theory</h3>
                <p className="text-sm">An RLC circuit contains a resistor (R), inductor (L), and capacitor (C). The impedance depends on frequency, and at resonance, the reactive components cancel.</p>
                <h4 className="font-medium text-sm">Key Equations</h4>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p>Resonant frequency: f₀ = 1/(2π√LC)</p>
                  <p>Series impedance: Z = √(R² + (X_L - X_C)²)</p>
                  <p>Quality factor: Q = (1/R)√(L/C)</p>
                </div>
                <h4 className="font-medium text-sm flex items-center gap-1"><Lightbulb className="h-3 w-3" /> Applications</h4>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Radio tuning circuits</li>
                  <li>Band-pass and band-stop filters</li>
                  <li>Power factor correction</li>
                  <li>Oscillator circuits</li>
                </ul>
              </TabsContent>
              <TabsContent value="procedure" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><ListChecks className="h-4 w-4" /> Procedure</h3>
                <ol className="text-sm list-decimal pl-5 space-y-2">
                  <li>Set R, L, C values using the sliders</li>
                  <li>Start the simulation and observe waveforms</li>
                  <li>Enable frequency sweep to see resonance curve</li>
                  <li>Find the resonant frequency where current is maximum</li>
                  <li>Toggle between series and parallel modes</li>
                  <li>Record impedance, current, and phase at different frequencies</li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RLCCircuitLab;
