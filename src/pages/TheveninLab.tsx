import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { TheveninSimulation } from '@/components/simulations/eee/TheveninSimulation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircuitBoard, Book, ListChecks, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TheveninLab = () => {
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
            <CircuitBoard className="h-6 w-6 text-primary" />
            Thevenin's Theorem Experiment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SimulationController
              type="physics"
              title="Thevenin's Theorem Verification"
              description="Verify Thevenin's theorem by finding equivalent circuit parameters"
              simulationType="thevenin"
              isRunning={isRunning}
              onToggle={() => setIsRunning(!isRunning)}
              onReset={() => setIsRunning(false)}
            >
              <TheveninSimulation isRunning={isRunning} />
            </SimulationController>
          </div>

          <div>
            <Tabs defaultValue="theory">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
              </TabsList>
              <TabsContent value="theory" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><Book className="h-4 w-4" /> Thevenin's Theorem</h3>
                <p className="text-sm">Any linear bilateral network with two terminals can be replaced by an equivalent circuit consisting of a voltage source V_th in series with a resistance R_th.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>V_th</strong> = Open circuit voltage across terminals</p>
                  <p><strong>R_th</strong> = Resistance seen from terminals with all sources deactivated</p>
                  <p><strong>I_L</strong> = V_th / (R_th + R_L)</p>
                </div>
                <p className="text-sm"><strong>Maximum Power Transfer:</strong> P_max occurs when R_L = R_th</p>
              </TabsContent>
              <TabsContent value="procedure" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><ListChecks className="h-4 w-4" /> Procedure</h3>
                <ol className="text-sm list-decimal pl-5 space-y-2">
                  <li>Set circuit parameters (V₁, R₁, R₂, R₃)</li>
                  <li>Step 1: Find open-circuit voltage V_OC across load terminals</li>
                  <li>Step 2: Find R_th by deactivating sources</li>
                  <li>Step 3: Draw Thevenin equivalent circuit</li>
                  <li>Vary R_L and observe load current and power</li>
                  <li>Verify maximum power transfer at R_L = R_th</li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TheveninLab;
