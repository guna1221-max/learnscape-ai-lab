
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendulumSimulation } from './physics/PendulumSimulation';
import { NewtonRingsSimulation } from './physics/NewtonRingsSimulation'; 
import { ChemicalReactionSimulation } from './chemistry/ChemicalReactionSimulation';
import { SonometerSimulation } from './physics/SonometerSimulation';
import { BHCurveSimulation } from './physics/BHCurveSimulation';
import { Play, Pause, RotateCcw, Download, Share, Ruler, Calculator } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SimulationControllerProps {
  type?: 'physics' | 'chemistry' | 'biology';
  title?: string;
  description?: string;
  simulationType?: string;
  isRunning?: boolean;
  onToggle?: () => void;
  onReset?: () => void;
  children?: React.ReactNode;
}

export function SimulationController({ 
  type, 
  title, 
  description, 
  simulationType = 'default',
  isRunning = false,
  onToggle,
  onReset,
  children
}: SimulationControllerProps) {
  const [internalIsRunning, setInternalIsRunning] = React.useState(false);
  const [simulationData, setSimulationData] = React.useState<any>(null);
  const [labMode, setLabMode] = React.useState<'setup' | 'experiment'>('setup');
  const [measurementMode, setMeasurementMode] = React.useState(false);
  
  // Use external state if provided, otherwise use internal state
  const handleStartStop = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsRunning(!internalIsRunning);
      
      toast({
        title: internalIsRunning ? "Simulation paused" : "Simulation started",
        duration: 1500,
      });
    }
  };
  
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      setInternalIsRunning(false);
      // Reset simulation data
      setSimulationData(null);
      
      toast({
        title: "Simulation reset",
        duration: 1500,
      });
    }
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Generating lab report",
      description: "Your JNTUA lab report will be ready in a moment.",
    });
    
    // Simulate report generation delay
    setTimeout(() => {
      toast({
        title: "Lab report ready",
        description: "Your JNTUA formatted lab report has been generated.",
      });
    }, 2000);
  };
  
  const handleShare = () => {
    toast({
      title: "Sharing options",
      description: "Share your lab results with your classmates.",
    });
  };

  const toggleMeasurementMode = () => {
    setMeasurementMode(!measurementMode);
    toast({
      title: measurementMode ? "Measurement mode disabled" : "Measurement mode enabled",
      description: measurementMode ? "Regular view restored" : "Click on the simulation to take measurements",
      duration: 1500,
    });
  };
  
  const toggleLabMode = () => {
    setLabMode(labMode === 'setup' ? 'experiment' : 'setup');
    toast({
      title: `Switched to ${labMode === 'setup' ? 'experiment' : 'setup'} view`,
      duration: 1500,
    });
  };
  
  const renderSimulation = () => {
    if (children) {
      return children;
    }

    switch (type) {
      case 'physics':
        if (simulationType === 'newtonRings') {
          return <NewtonRingsSimulation />;
        } else if (simulationType === 'sonometer') {
          return <SonometerSimulation isRunning={internalIsRunning} />;
        } else if (simulationType === 'bhcurve') {
          return <BHCurveSimulation isRunning={internalIsRunning} />;
        }
        return <PendulumSimulation />;
      case 'chemistry':
        return <ChemicalReactionSimulation />;
      case 'biology':
        return <div className="h-60 flex items-center justify-center text-muted-foreground">
          Biology simulation module loading soon
        </div>;
      default:
        return null;
    }
  };

  // Use either the external or internal state
  const displayIsRunning = onToggle ? isRunning : internalIsRunning;

  return (
    <Card className="shadow-lg">
      {(title || description) && (
        <CardHeader className="pb-3">
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {simulationType && (
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">
              JNTUA R23 Lab Manual
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLabMode}
            >
              {labMode === 'setup' ? 'View Experiment' : 'View Setup'}
            </Button>
          </div>
        )}
        
        <div className="bg-card border rounded-lg overflow-hidden">
          {renderSimulation()}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              variant={displayIsRunning ? "destructive" : "default"}
              size="sm"
              onClick={handleStartStop}
            >
              {displayIsRunning ? (
                <><Pause className="mr-1 h-4 w-4" /> Pause</>
              ) : (
                <><Play className="mr-1 h-4 w-4" /> Start</>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="mr-1 h-4 w-4" /> Reset
            </Button>

            <Button
              variant={measurementMode ? "secondary" : "outline"}
              size="sm"
              onClick={toggleMeasurementMode}
            >
              <Ruler className="mr-1 h-4 w-4" /> Measure
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateReport}
            >
              <Download className="mr-1 h-4 w-4" /> Report
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
            >
              <Share className="mr-1 h-4 w-4" /> Share
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: "Opening calculator",
                  description: "Scientific calculator opened for lab calculations",
                });
              }}
            >
              <Calculator className="mr-1 h-4 w-4" /> Calculate
            </Button>
          </div>
        </div>
        
        {(!onToggle && !onReset && !children) && (
          <Tabs defaultValue="settings" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="settings">Equipment</TabsTrigger>
              <TabsTrigger value="procedure">Procedure</TabsTrigger>
              <TabsTrigger value="data">Readings</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="p-4 border rounded-md mt-2">
              <div className="text-sm">
                <h3 className="font-medium mb-2">Laboratory Equipment</h3>
                <p>Adjust the experimental setup parameters according to the JNTUA R23 lab manual guidelines.</p>
                {simulationType === 'newtonRings' && (
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Plano-convex lens</li>
                    <li>Optical flat (glass plate)</li>
                    <li>Sodium lamp with power supply</li>
                    <li>Traveling microscope with vernier scale</li>
                    <li>Spherometer</li>
                  </ul>
                )}
                {simulationType === 'sonometer' && (
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Sonometer with weights</li>
                    <li>Steel wire</li>
                    <li>AC power supply</li>
                    <li>Permanent magnets</li>
                    <li>Measuring scale and weight hanger</li>
                  </ul>
                )}
                {simulationType === 'bhcurve' && (
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Toroid core with primary & secondary windings</li>
                    <li>Digital storage oscilloscope</li>
                    <li>Function generator</li>
                    <li>Resistors and connecting wires</li>
                    <li>Ammeter and voltmeter</li>
                  </ul>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="procedure" className="p-4 border rounded-md mt-2">
              <div className="text-sm">
                <h3 className="font-medium mb-2">JNTUA R23 Laboratory Procedure</h3>
                {simulationType === 'newtonRings' && (
                  <ol className="list-decimal pl-4 mt-2 space-y-1">
                    <li>Clean the glass plate and plano-convex lens with lens paper</li>
                    <li>Place the optical flat on the base of the microscope</li>
                    <li>Place the plano-convex lens with its curved surface facing downward</li>
                    <li>Illuminate the setup with sodium light from above</li>
                    <li>Observe the Newton's rings pattern through the microscope</li>
                    <li>Measure the diameter of various rings using vernier scale</li>
                    <li>Calculate wavelength of light and radius of curvature of lens</li>
                  </ol>
                )}
                {simulationType === 'sonometer' && (
                  <ol className="list-decimal pl-4 mt-2 space-y-1">
                    <li>Setup the sonometer on a horizontal table</li>
                    <li>Attach the steel wire over the pulley with weight hanger</li>
                    <li>Place the AC electromagnet under the wire at one position</li>
                    <li>Adjust the position of bridges to achieve resonance</li>
                    <li>Measure the length of wire between bridges</li>
                    <li>Change weights and record new resonant lengths</li>
                    <li>Calculate frequency of AC source and wire tension</li>
                  </ol>
                )}
                {simulationType === 'bhcurve' && (
                  <ol className="list-decimal pl-4 mt-2 space-y-1">
                    <li>Connect the circuit as per the schematic diagram</li>
                    <li>Connect primary winding to function generator</li>
                    <li>Connect CRO to measure magnetic field intensity H</li>
                    <li>Gradually increase the function generator voltage</li>
                    <li>Record B and H values from oscilloscope readings</li>
                    <li>Plot the B-H curve using the recorded values</li>
                    <li>Calculate hysteresis loss from the area of the loop</li>
                  </ol>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="p-4 border rounded-md mt-2">
              <div className="text-sm">
                <h3 className="font-medium mb-2">Experimental Readings</h3>
                <p>Record your observations here as per JNTUA R23 lab manual format.</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">S.No</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Reading 1</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Reading 2</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Calculated Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{i + 1}</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">-</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">-</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="p-4 border rounded-md mt-2">
              <div className="text-sm">
                <h3 className="font-medium mb-2">Lab Notes & Observations</h3>
                <p>Record your observations and notes about the experiment here.</p>
                <textarea 
                  className="w-full mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md h-24" 
                  placeholder="Type your observations here..."
                />
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Precautions:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {simulationType === 'newtonRings' && (
                      <>
                        <li>Handle optical components with care to avoid scratches</li>
                        <li>Ensure proper focusing of the traveling microscope</li>
                        <li>Take multiple readings for accuracy</li>
                      </>
                    )}
                    {simulationType === 'sonometer' && (
                      <>
                        <li>Ensure the sonometer wire is not overstretched</li>
                        <li>Keep magnetic materials away from the experiment</li>
                        <li>Verify resonance condition carefully</li>
                      </>
                    )}
                    {simulationType === 'bhcurve' && (
                      <>
                        <li>Ensure proper connections to avoid electrical hazards</li>
                        <li>Properly calibrate the CRO before measurements</li>
                        <li>Avoid magnetic saturation of the core</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
