
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendulumSimulation } from './physics/PendulumSimulation';
import { ChemicalReactionSimulation } from './chemistry/ChemicalReactionSimulation';
import { Play, Pause, RotateCcw, Download, Share } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SimulationControllerProps {
  type: 'physics' | 'chemistry' | 'biology';
  title: string;
  description?: string;
}

export function SimulationController({ type, title, description }: SimulationControllerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);
  
  const handleStartStop = () => {
    setIsRunning(!isRunning);
    
    toast({
      title: isRunning ? "Simulation paused" : "Simulation started",
      duration: 1500,
    });
  };
  
  const handleReset = () => {
    setIsRunning(false);
    // Reset simulation data
    setSimulationData(null);
    
    toast({
      title: "Simulation reset",
      duration: 1500,
    });
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
    switch (type) {
      case 'physics':
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

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-card border rounded-lg overflow-hidden">
          {renderSimulation()}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={handleStartStop}
            >
              {isRunning ? (
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
      </CardContent>
    </Card>
  );
}
