
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendulumSimulation } from './physics/PendulumSimulation';
import { NewtonRingsSimulation } from './physics/NewtonRingsSimulation'; 
import { ChemicalReactionSimulation } from './chemistry/ChemicalReactionSimulation';
import { SonometerSimulation } from './physics/SonometerSimulation';
import { BHCurveSimulation } from './physics/BHCurveSimulation';
import { Play, Pause, RotateCcw, Download, Share } from 'lucide-react';
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
      title: "Generating report",
      description: "Your simulation report will be ready in a moment.",
    });
    
    // Simulate report generation delay
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Your simulation report has been generated.",
      });
    }, 2000);
  };
  
  const handleShare = () => {
    toast({
      title: "Sharing options",
      description: "Share your simulation results with your class.",
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
          </div>
        </div>
        
        {(!onToggle && !onReset && !children) && (
          <Tabs defaultValue="settings" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="p-4 border rounded-md mt-2">
              <div className="text-sm">
                Adjust simulation parameters here. Settings panel will be specific to the simulation type.
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="p-4 border rounded-md mt-2">
              <div className="text-sm">
                Collected data will appear here during simulation runtime.
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="p-4 border rounded-md mt-2">
              <div className="text-sm">
                Add your observations and notes about the experiment here.
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
