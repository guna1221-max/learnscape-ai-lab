import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { TransformerSimulation } from '@/components/simulations/eee/TransformerSimulation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Book, ListChecks, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TransformerLab = () => {
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
            Transformer OC & SC Tests
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SimulationController
              type="physics"
              title="Transformer Open & Short Circuit Tests"
              description="Determine equivalent circuit parameters and efficiency of a single-phase transformer"
              simulationType="transformer"
              isRunning={isRunning}
              onToggle={() => setIsRunning(!isRunning)}
              onReset={() => setIsRunning(false)}
            >
              <TransformerSimulation isRunning={isRunning} />
            </SimulationController>
          </div>

          <div>
            <Tabs defaultValue="theory">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
              </TabsList>
              <TabsContent value="theory" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><Book className="h-4 w-4" /> Transformer Tests</h3>
                <p className="text-sm"><strong>Open Circuit Test:</strong> Determines core losses (iron losses) and magnetizing parameters (R₀, X₀). Conducted at rated voltage on LV side.</p>
                <p className="text-sm"><strong>Short Circuit Test:</strong> Determines copper losses and equivalent impedance (R_eq, X_eq). Conducted at reduced voltage on HV side.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p>η = Output / (Output + Core Loss + Cu Loss)</p>
                  <p>Max efficiency when Cu Loss = Core Loss</p>
                  <p>Regulation = (V_NL - V_FL) / V_FL × 100%</p>
                </div>
              </TabsContent>
              <TabsContent value="procedure" className="p-4 border rounded-md mt-2 space-y-3">
                <h3 className="font-medium flex items-center gap-2"><ListChecks className="h-4 w-4" /> Procedure</h3>
                <ol className="text-sm list-decimal pl-5 space-y-2">
                  <li><strong>OC Test:</strong> Apply rated voltage to LV side, keep HV open</li>
                  <li>Record V₀, I₀, W₀ (wattmeter reading)</li>
                  <li>Calculate R₀ = V₀²/W₀, X₀ from I₀ components</li>
                  <li><strong>SC Test:</strong> Short HV side, apply reduced voltage to LV</li>
                  <li>Increase voltage until rated current flows</li>
                  <li>Record V_sc, I_sc, W_sc</li>
                  <li>Calculate R_eq, X_eq, Z_eq from SC readings</li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransformerLab;
