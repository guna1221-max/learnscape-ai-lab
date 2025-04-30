
import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Magnet, CircleDashed } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BHCurveSimulationProps {
  isRunning?: boolean;
}

export function BHCurveSimulation({ isRunning = false }: BHCurveSimulationProps) {
  const [currentIntensity, setCurrentIntensity] = useState<number>(40);
  const [ironCore, setIronCore] = useState<boolean>(true);
  const [showHysteresis, setShowHysteresis] = useState<boolean>(false);
  const [data, setData] = useState<{h: number[], b: number[]}>({ h: [], b: [] });
  const [hysteresisData, setHysteresisData] = useState<{
    forward: {h: number[], b: number[]},
    reverse: {h: number[], b: number[]}
  }>({
    forward: {h: [], b: []},
    reverse: {h: [], b: []}
  });
  const animationRef = useRef<number | null>(null);
  const [cycleCompleted, setCycleCompleted] = useState<boolean>(false);
  
  // Generate B-H curve data
  useEffect(() => {
    if (isRunning) {
      generateBHCurveData();
      if (showHysteresis && ironCore) {
        generateHysteresisData();
      }
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      setCycleCompleted(false);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning, currentIntensity, ironCore, showHysteresis]);

  const generateBHCurveData = () => {
    // H values (magnetic field intensity) range
    const hValues = Array.from({ length: 100 }, (_, i) => i * (currentIntensity / 25));
    
    // B values (magnetic flux density)
    const bValues = hValues.map(h => {
      if (ironCore) {
        // Simulate iron core (shows saturation)
        // Simplified model of ferromagnetic material response
        if (h < 10) {
          return h * 0.05 * currentIntensity;
        } else if (h < 30) {
          return (10 * 0.05 * currentIntensity) + ((h - 10) * 0.02 * currentIntensity);
        } else {
          // Saturation region - very small increase with H
          return (10 * 0.05 * currentIntensity) + (20 * 0.02 * currentIntensity) + 
                 ((h - 30) * 0.001 * currentIntensity);
        }
      } else {
        // Linear relationship for air core (μ0 = 4π × 10^-7)
        // Simplified for visualization
        return h * 0.01 * currentIntensity;
      }
    });
    
    setData({ h: hValues, b: bValues });
  };

  const generateHysteresisData = () => {
    // Create a full magnetization cycle with hysteresis
    
    // Forward magnetization (increasing H field)
    const hForward = Array.from({ length: 100 }, (_, i) => (i * 2 - 100) * (currentIntensity / 50));
    
    const bForward = hForward.map(h => {
      const absH = Math.abs(h);
      let value;
      
      if (h < 0) {
        // Negative magnetization
        if (absH < 10) {
          value = -((absH * 0.05 * currentIntensity) * 0.8);
        } else if (absH < 30) {
          value = -((10 * 0.05 * currentIntensity) + ((absH - 10) * 0.02 * currentIntensity)) * 0.8;
        } else {
          value = -((10 * 0.05 * currentIntensity) + (20 * 0.02 * currentIntensity) + 
                 ((absH - 30) * 0.001 * currentIntensity)) * 0.8;
        }
        
        // Add remanence (shifted curve)
        value = value - (0.2 * currentIntensity);
      } else {
        // Positive magnetization
        if (absH < 10) {
          value = (absH * 0.05 * currentIntensity) * 0.8;
        } else if (absH < 30) {
          value = ((10 * 0.05 * currentIntensity) + ((absH - 10) * 0.02 * currentIntensity)) * 0.8;
        } else {
          value = ((10 * 0.05 * currentIntensity) + (20 * 0.02 * currentIntensity) + 
                 ((absH - 30) * 0.001 * currentIntensity)) * 0.8;
        }
        
        // Add remanence (shifted curve)
        value = value + (0.2 * currentIntensity);
      }
      
      return value;
    });
    
    // Reverse magnetization (decreasing H field)
    // For hysteresis, the reverse path will be different from the forward path
    const hReverse = [...hForward];
    
    const bReverse = hReverse.map((h, i) => {
      const absH = Math.abs(h);
      let value;
      
      if (h < 0) {
        if (absH < 10) {
          value = -((absH * 0.05 * currentIntensity) * 0.8);
        } else if (absH < 30) {
          value = -((10 * 0.05 * currentIntensity) + ((absH - 10) * 0.02 * currentIntensity)) * 0.8;
        } else {
          value = -((10 * 0.05 * currentIntensity) + (20 * 0.02 * currentIntensity) + 
                 ((absH - 30) * 0.001 * currentIntensity)) * 0.8;
        }
        
        // Add remanence (shifted curve) - opposite for reverse path
        value = value + (0.2 * currentIntensity);
      } else {
        if (absH < 10) {
          value = (absH * 0.05 * currentIntensity) * 0.8;
        } else if (absH < 30) {
          value = ((10 * 0.05 * currentIntensity) + ((absH - 10) * 0.02 * currentIntensity)) * 0.8;
        } else {
          value = ((10 * 0.05 * currentIntensity) + (20 * 0.02 * currentIntensity) + 
                 ((absH - 30) * 0.001 * currentIntensity)) * 0.8;
        }
        
        // Add remanence (shifted curve) - opposite for reverse path
        value = value - (0.2 * currentIntensity);
      }
      
      return value;
    });
    
    setHysteresisData({
      forward: { h: hForward, b: bForward },
      reverse: { h: hReverse, b: bReverse }
    });
    
    setCycleCompleted(true);
  };

  const animate = () => {
    // This function would be used for dynamic animations if needed
    animationRef.current = requestAnimationFrame(animate);
  };

  const resetHysteresis = () => {
    setCycleCompleted(false);
    setHysteresisData({
      forward: {h: [], b: []},
      reverse: {h: [], b: []}
    });
    if (isRunning) {
      generateHysteresisData();
    }
  };

  const chartData = {
    labels: showHysteresis && ironCore ? hysteresisData.forward.h : data.h,
    datasets: showHysteresis && ironCore ? [
      {
        label: 'Forward Magnetization',
        data: hysteresisData.forward.b,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Reverse Magnetization',
        data: hysteresisData.reverse.b,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        pointRadius: 0,
      }
    ] : [
      {
        label: 'B-H Curve',
        data: data.b,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'H (A/m)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'B (T)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: showHysteresis && ironCore ? 'Magnetic Hysteresis Loop' : 'Magnetic B-H Curve',
      },
    },
  };

  return (
    <div className="p-4 space-y-6">
      <div className="h-[300px]">
        <Line options={chartOptions} data={chartData} />
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="current-intensity">Current Intensity</Label>
                    <span className="text-sm text-muted-foreground">{currentIntensity} A</span>
                  </div>
                  <Slider
                    id="current-intensity"
                    min={10}
                    max={100}
                    step={5}
                    value={[currentIntensity]}
                    onValueChange={(value) => setCurrentIntensity(value[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Magnet className="h-4 w-4 text-primary" />
                    <Label htmlFor="iron-core">Iron Core</Label>
                  </div>
                  <Switch
                    id="iron-core"
                    checked={ironCore}
                    onCheckedChange={setIronCore}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <CircleDashed className="h-4 w-4 text-primary" />
                    <Label htmlFor="show-hysteresis">Show Hysteresis Loop</Label>
                  </div>
                  <Switch
                    id="show-hysteresis"
                    checked={showHysteresis}
                    onCheckedChange={(checked) => {
                      setShowHysteresis(checked);
                      if (checked && ironCore && !cycleCompleted) {
                        generateHysteresisData();
                      }
                    }}
                    disabled={!ironCore}
                  />
                </div>
                
                {showHysteresis && ironCore && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetHysteresis} 
                    className="w-full"
                  >
                    Reset Hysteresis Cycle
                  </Button>
                )}
                
                {showHysteresis && !ironCore && (
                  <p className="text-xs text-muted-foreground italic">
                    Hysteresis only occurs in ferromagnetic materials. Enable "Iron Core" to see the effect.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
