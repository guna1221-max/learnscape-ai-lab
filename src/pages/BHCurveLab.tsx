
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { BHCurveSimulation } from '@/components/simulations/physics/BHCurveSimulation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Magnet, Book, Lightbulb, FlaskConical, ListChecks, CircleDashed, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BHCurveLab = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const handleToggle = () => {
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    setIsRunning(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Magnet className="h-8 w-8 text-primary" />
            B-H Curve & Hysteresis Experiment
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore the relationship between magnetic field intensity (H) and magnetic flux density (B), 
            including ferromagnetic hysteresis effects
          </p>
        </div>
        
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            This virtual laboratory equipment simulates real-world ferromagnetic hysteresis analysis. Remember to turn on the power supply before starting measurements.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <SimulationController 
              type="physics"
              title="B-H Curve & Hysteresis Laboratory"
              description="Using virtual magnetometer and fluxmeter to study ferromagnetic materials"
              simulationType="bhcurve"
              isRunning={isRunning}
              onToggle={handleToggle}
              onReset={handleReset}
            >
              <BHCurveSimulation isRunning={isRunning} />
            </SimulationController>
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="theory" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theory" className="p-4 border rounded-md mt-2 space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Book className="h-4 w-4" /> B-H Curve Basics
                    </h3>
                    <p className="text-sm mt-1">
                      The B-H curve (or magnetization curve) shows the relationship between magnetic flux density (B) 
                      and the magnetizing force (H) for a ferromagnetic material. It's vital for understanding magnetic 
                      materials' behavior in transformers, motors, and other electromagnetic devices.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <CircleDashed className="h-4 w-4" /> Magnetic Hysteresis
                    </h3>
                    <p className="text-sm mt-1">
                      Hysteresis is the phenomenon where a material's magnetization depends not only on the current 
                      magnetic field but also on its previous magnetic states. This creates a loop in the B-H curve 
                      and results in energy loss during magnetization cycles.
                    </p>
                    <ul className="text-sm mt-1 list-disc pl-5 space-y-1">
                      <li>Remanence: Residual magnetization when external field is removed</li>
                      <li>Coercivity: Reverse field required to demagnetize the material</li>
                      <li>Hysteresis loss: Energy dissipated as heat during a magnetization cycle</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" /> Key Concepts
                    </h3>
                    <ul className="text-sm mt-1 list-disc pl-5 space-y-1">
                      <li>Magnetic flux density (B) is measured in teslas (T)</li>
                      <li>Magnetic field intensity (H) is measured in amperes per meter (A/m)</li>
                      <li>The permeability (μ) of a material determines its response to a magnetic field</li>
                      <li>Ferromagnetic materials show non-linear B-H curves with saturation</li>
                      <li>Air cores show linear B-H relationships without hysteresis</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <FlaskConical className="h-4 w-4" /> Applications
                    </h3>
                    <p className="text-sm mt-1">
                      Understanding B-H curves and hysteresis is crucial for designing:
                    </p>
                    <ul className="text-sm mt-1 list-disc pl-5 space-y-1">
                      <li>Transformers and inductors (minimizing hysteresis losses)</li>
                      <li>Electric motors and generators</li>
                      <li>Magnetic recording media (utilizing hysteresis)</li>
                      <li>Magnetic shields and sensors</li>
                      <li>Memory devices (hysteresis enables stable states)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="procedure" className="p-4 border rounded-md mt-2 space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Laboratory Procedure</h3>
                    <ol className="text-sm mt-2 list-decimal pl-5 space-y-2">
                      <li><strong>Setup Equipment:</strong> First, power on the system using the POWER ON button in the power supply unit</li>
                      <li><strong>Material Selection:</strong> Choose between iron core (ferromagnetic) and air core using the toggle switch</li>
                      <li><strong>Set Current:</strong> Adjust the current intensity using the slider (start with 40A)</li>
                      <li><strong>Begin Measurement:</strong> Press the "Start" button to begin recording data</li>
                      <li><strong>Observe B-H Curve:</strong> Watch the oscilloscope display as it plots the relationship between H and B</li>
                      <li><strong>Enable Hysteresis Loop:</strong> With iron core selected, turn on the "Hysteresis Loop" toggle</li>
                      <li><strong>Analyze Loop Shape:</strong> Observe the differences in forward and reverse magnetization paths</li>
                      <li><strong>Reset and Repeat:</strong> Use the "Reset Hysteresis Cycle" button to perform multiple measurements</li>
                      <li><strong>Safety Procedure:</strong> When finished, power off the equipment using the POWER OFF button</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <ListChecks className="h-4 w-4" /> Data Collection
                    </h3>
                    <p className="text-sm mt-1">
                      In your lab report, record and analyze:
                    </p>
                    <ul className="text-sm mt-1 list-disc pl-5 space-y-1">
                      <li>The initial slope of the B-H curve (initial permeability)</li>
                      <li>The point where the curve begins to flatten (saturation begins)</li>
                      <li>The maximum value of B (saturation flux density)</li>
                      <li>The width of the hysteresis loop (related to energy loss)</li>
                      <li>The residual magnetization when H = 0 (remanence)</li>
                      <li>The field required to reduce B to zero (coercivity)</li>
                      <li>Temperature changes during extended operation (related to power losses)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quiz" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Test Your Knowledge</h3>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">1. What does a flattening B-H curve indicate?</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <input type="radio" id="q1a" name="q1" className="mr-2" />
                        <label htmlFor="q1a">Decreasing permeability</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q1b" name="q1" className="mr-2" />
                        <label htmlFor="q1b">Magnetic saturation</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q1c" name="q1" className="mr-2" />
                        <label htmlFor="q1c">Magnetic resonance</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">2. Why does an air core show a linear B-H relationship?</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <input type="radio" id="q2a" name="q2" className="mr-2" />
                        <label htmlFor="q2a">Air never saturates magnetically</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q2b" name="q2" className="mr-2" />
                        <label htmlFor="q2b">Air has constant permeability</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q2c" name="q2" className="mr-2" />
                        <label htmlFor="q2c">Both of the above</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">3. What causes magnetic hysteresis?</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <input type="radio" id="q3a" name="q3" className="mr-2" />
                        <label htmlFor="q3a">Temperature changes in the material</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q3b" name="q3" className="mr-2" />
                        <label htmlFor="q3b">Domain wall motion requires energy</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q3c" name="q3" className="mr-2" />
                        <label htmlFor="q3c">Poor conductivity of the material</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">Check Answers</Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ask our AI tutor about magnetic hysteresis, B-H curves, or any physics concepts.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="/tutor">Chat with AI Tutor</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BHCurveLab;
