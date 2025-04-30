
import { useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
import { SonometerSimulation } from '@/components/simulations/physics/SonometerSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { School, Lightbulb, BookOpen, FileText } from 'lucide-react';

const SonometerLab = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [resetFn, setResetFn] = useState<() => void>(() => () => {});
  
  const handleToggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);
  
  const handleReset = useCallback(() => {
    setIsRunning(false);
    resetFn();
  }, [resetFn]);
  
  const handleSetResetFn = useCallback((fn: () => void) => {
    setResetFn(() => fn);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <School className="h-8 w-8 text-primary" />
          Sonometer Experiment
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <SimulationController
              type="physics"
              title="Sonometer Simulation"
              description="Investigate standing waves and resonance in strings"
              simulationType="sonometer"
              isRunning={isRunning}
              onToggle={handleToggle}
              onReset={handleReset}
            >
              <SonometerSimulation 
                isRunning={isRunning} 
                onReset={handleSetResetFn}
              />
            </SimulationController>
            
            <Tabs defaultValue="theory" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="theory" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Theory</span>
                </TabsTrigger>
                <TabsTrigger value="procedure" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Procedure</span>
                </TabsTrigger>
                <TabsTrigger value="observations" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Observations</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  <span className="hidden sm:inline">Quiz</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="theory" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Understanding Sonometer</CardTitle>
                    <CardDescription>The physics behind standing waves in strings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-medium">Standing Waves Principles</h3>
                    <p>
                      A sonometer is an apparatus used to study the properties of standing waves on strings, 
                      particularly the relationship between frequency, tension, and length. The instrument
                      consists of a hollow wooden box with one or more strings stretched over it.
                    </p>
                    
                    <h3 className="text-lg font-medium">Mathematical Relationships</h3>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium">The frequency of vibration (f) in a stretched string is given by:</p>
                      <div className="flex items-center justify-center my-4">
                        <span className="text-lg font-medium">f = (1/2L) × √(T/μ)</span>
                      </div>
                      <p>Where:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>L = Length of the string</li>
                        <li>T = Tension in the string</li>
                        <li>μ = Mass per unit length of the string</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-lg font-medium">Resonance and Overtones</h3>
                    <p>
                      When a string vibrates, it can form standing wave patterns with nodes and anti-nodes. 
                      The fundamental frequency has nodes only at the fixed ends, while harmonics or overtones
                      have additional nodes between the ends.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="procedure" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Experimental Procedure</CardTitle>
                    <CardDescription>Step-by-step guide to conducting the sonometer experiment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-3">
                      <li>Begin with the sonometer setup, ensuring the string is properly tensioned.</li>
                      <li>Set the movable bridge at a specific position to create a defined length of string.</li>
                      <li>Adjust the tension using the weights on the pulley system.</li>
                      <li>Pluck the string to create a standing wave.</li>
                      <li>Observe the relationship between string length and frequency (pitch).</li>
                      <li>Measure and record the frequency for different string lengths.</li>
                      <li>Change the tension and repeat measurements.</li>
                      <li>Plot the relationship between frequency and the inverse of length.</li>
                      <li>Plot the relationship between frequency and the square root of tension.</li>
                      <li>Compare your results with theoretical predictions.</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="observations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Observations & Analysis</CardTitle>
                    <CardDescription>Record your experimental findings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Expected Observations:</h3>
                        <ul className="list-disc list-inside space-y-2">
                          <li>The frequency is inversely proportional to the length of the string.</li>
                          <li>The frequency is proportional to the square root of the tension.</li>
                          <li>Resonance occurs at specific lengths related to the driving frequency.</li>
                          <li>Harmonics appear at precise string length ratios.</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2">Data Collection:</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Use the simulation to gather data by varying string length, tension, and observing the 
                          resulting frequencies. Record your observations in the following table:
                        </p>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">String Length (cm)</th>
                                <th className="text-left p-2">Tension (N)</th>
                                <th className="text-left p-2">Observed Frequency (Hz)</th>
                                <th className="text-left p-2">Calculated Frequency (Hz)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b">
                                  <td className="p-2"></td>
                                  <td className="p-2"></td>
                                  <td className="p-2"></td>
                                  <td className="p-2"></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quiz" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Your Knowledge</CardTitle>
                    <CardDescription>Answer these questions to check your understanding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <p className="font-medium">1. What happens to the frequency of a vibrating string when its length is halved?</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q1a" name="q1" className="h-4 w-4" />
                            <label htmlFor="q1a">The frequency is halved.</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q1b" name="q1" className="h-4 w-4" />
                            <label htmlFor="q1b">The frequency is doubled.</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q1c" name="q1" className="h-4 w-4" />
                            <label htmlFor="q1c">The frequency remains the same.</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q1d" name="q1" className="h-4 w-4" />
                            <label htmlFor="q1d">The frequency is quadrupled.</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-medium">2. How does the frequency of a vibrating string change if the tension is quadrupled?</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q2a" name="q2" className="h-4 w-4" />
                            <label htmlFor="q2a">The frequency is doubled.</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q2b" name="q2" className="h-4 w-4" />
                            <label htmlFor="q2b">The frequency is quadrupled.</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q2c" name="q2" className="h-4 w-4" />
                            <label htmlFor="q2c">The frequency is halved.</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q2d" name="q2" className="h-4 w-4" />
                            <label htmlFor="q2d">The frequency remains unchanged.</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-medium">3. What is the primary purpose of a sonometer?</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q3a" name="q3" className="h-4 w-4" />
                            <label htmlFor="q3a">To measure sound intensity</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q3b" name="q3" className="h-4 w-4" />
                            <label htmlFor="q3b">To study standing waves in strings</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q3c" name="q3" className="h-4 w-4" />
                            <label htmlFor="q3c">To amplify sound</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="q3d" name="q3" className="h-4 w-4" />
                            <label htmlFor="q3d">To record sound waves</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <AiChatbox context="Sonometer Experiment - Physics" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SonometerLab;
