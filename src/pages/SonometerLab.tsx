
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { SonometerSimulation } from '@/components/simulations/physics/SonometerSimulation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Book, Lightbulb, ListChecks, Music } from 'lucide-react';

const SonometerLab = () => {
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
            <Music className="h-8 w-8 text-primary" />
            Sonometer Experiment
          </h1>
          <p className="text-muted-foreground mt-2">
            Investigate the physics of vibrating strings and explore the relationship between frequency, tension, and length
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <SimulationController 
              type="physics"
              title="Sonometer Simulation"
              description="Observe how vibrating strings produce sound waves"
              simulationType="sonometer"
              isRunning={isRunning}
              onToggle={handleToggle}
              onReset={handleReset}
            >
              <SonometerSimulation isRunning={isRunning} />
            </SimulationController>
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="theory" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theory" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Book className="h-4 w-4" /> Sonometer Basics
                    </h3>
                    <p className="text-sm mt-1">
                      A sonometer is a device used to study the vibration of strings under tension. It demonstrates the relationship between frequency, tension, length, and mass per unit length of a vibrating string.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" /> Key Concepts
                    </h3>
                    <p className="text-sm mt-1">
                      The fundamental frequency (f) of a vibrating string is given by:
                    </p>
                    <div className="bg-muted p-2 rounded text-center mt-2 mb-2">
                      f = (1/2L) × √(T/μ)
                    </div>
                    <p className="text-sm">
                      Where: L = length of string, T = tension in the string, μ = mass per unit length
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="procedure" className="p-4 border rounded-md mt-2 space-y-4">
                <div>
                  <h3 className="font-medium">Experiment Procedure</h3>
                  <ol className="text-sm mt-2 list-decimal pl-5 space-y-2">
                    <li>Start the simulation by pressing the "Start" button</li>
                    <li>Observe the wave pattern formed on the string</li>
                    <li>Adjust parameters to see how they affect the vibration</li>
                    <li>Record your observations in each case</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <ListChecks className="h-4 w-4" /> Observations
                  </h3>
                  <p className="text-sm mt-1">
                    In your observations, note:
                  </p>
                  <ul className="text-sm mt-1 list-disc pl-5">
                    <li>How frequency changes with tension</li>
                    <li>The relationship between string length and frequency</li>
                    <li>How different harmonics form on the string</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="quiz" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Test Your Knowledge</h3>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">1. What happens to the frequency when string length increases?</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <input type="radio" id="q1a" name="q1" className="mr-2" />
                        <label htmlFor="q1a">Frequency increases</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q1b" name="q1" className="mr-2" />
                        <label htmlFor="q1b">Frequency decreases</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q1c" name="q1" className="mr-2" />
                        <label htmlFor="q1c">Frequency stays the same</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">2. If you double the tension in a string, what happens to the frequency?</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <input type="radio" id="q2a" name="q2" className="mr-2" />
                        <label htmlFor="q2a">Increases by a factor of √2</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q2b" name="q2" className="mr-2" />
                        <label htmlFor="q2b">Doubles</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q2c" name="q2" className="mr-2" />
                        <label htmlFor="q2c">Decreases by half</label>
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
                Ask our AI tutor about standing waves, harmonics, or any other physics concepts.
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

export default SonometerLab;
