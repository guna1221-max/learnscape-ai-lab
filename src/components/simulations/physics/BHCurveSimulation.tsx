
import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Magnet, CircleDashed, Power, Zap, FlaskConical, Gauge, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Using Recharts - no registration needed

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
  const [powerStatus, setPowerStatus] = useState<boolean>(false);
  const [equipmentExpanded, setEquipmentExpanded] = useState<boolean>(true);
  const [measurementStatus, setMeasurementStatus] = useState<string>("Idle");
  const [coilTemperature, setCoilTemperature] = useState<number>(22); // room temp in Celsius
  
  // Generate B-H curve data
  useEffect(() => {
    if (isRunning) {
      if (powerStatus) {
        generateBHCurveData();
        if (showHysteresis && ironCore) {
          generateHysteresisData();
          setMeasurementStatus("Recording hysteresis loop...");
        } else {
          setMeasurementStatus("Measuring B-H relationship...");
        }
        animationRef.current = requestAnimationFrame(animate);
        
        // Simulate coil heating due to current
        const heatingInterval = setInterval(() => {
          setCoilTemperature(prev => {
            const maxTemp = 22 + currentIntensity * 0.4;
            return prev < maxTemp ? prev + 0.2 : maxTemp;
          });
        }, 1000);
        
        return () => {
          clearInterval(heatingInterval);
        };
      } else {
        setMeasurementStatus("Power off. Turn on power to begin measurement.");
      }
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        setCycleCompleted(false);
        setMeasurementStatus("Measurement paused.");
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning, currentIntensity, ironCore, showHysteresis, powerStatus]);

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
    setMeasurementStatus("Hysteresis loop measurement complete.");
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
    if (isRunning && powerStatus) {
      setMeasurementStatus("Resetting measurement...");
      setTimeout(() => {
        generateHysteresisData();
        setMeasurementStatus("New hysteresis loop recorded.");
      }, 1000);
    }
  };

  const togglePower = () => {
    const newPowerStatus = !powerStatus;
    setPowerStatus(newPowerStatus);
    
    if (!newPowerStatus) {
      // Power turned off
      setMeasurementStatus("Power off. System cooling down.");
      
      // Simulate cooling down
      const coolingInterval = setInterval(() => {
        setCoilTemperature(prev => {
          const newTemp = prev - 0.5;
          if (newTemp <= 22) {
            clearInterval(coolingInterval);
            return 22;
          }
          return newTemp;
        });
      }, 1000);
    } else {
      // Power turned on
      setMeasurementStatus("Power on. System initializing...");
      setTimeout(() => {
        setMeasurementStatus("Ready for measurement.");
      }, 2000);
    }
  };

  // Prepare data for Recharts
  const chartData = React.useMemo(() => {
    if (showHysteresis && ironCore) {
      const forwardData = hysteresisData.forward.h.map((h, i) => ({
        h,
        forward: hysteresisData.forward.b[i],
        reverse: hysteresisData.reverse.b[i] || null,
      }));
      return forwardData;
    } else {
      return data.h.map((h, i) => ({
        h,
        b: data.b[i],
      }));
    }
  }, [data, hysteresisData, showHysteresis, ironCore]);

  const chartConfig = {
    forward: {
      label: "Forward Magnetization",
      color: "hsl(var(--primary))",
    },
    reverse: {
      label: "Reverse Magnetization",
      color: "hsl(var(--destructive))",
    },
    b: {
      label: "B-H Curve",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="p-4 space-y-6">
      {/* Laboratory Equipment Panel */}
      <Card className="border-2 border-gray-300 shadow-md">
        <div 
          className="flex justify-between items-center p-3 bg-slate-100 cursor-pointer"
          onClick={() => setEquipmentExpanded(!equipmentExpanded)}
        >
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h3 className="font-bold">Laboratory Equipment</h3>
          </div>
          {equipmentExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {equipmentExpanded && (
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Power Supply Unit */}
              <div className="bg-slate-800 rounded-md p-4 text-white shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium">Power Supply Unit</h4>
                  <div className={`h-2 w-2 rounded-full ${powerStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant={powerStatus ? "destructive" : "default"}
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={togglePower}
                  >
                    <Power className="h-4 w-4" />
                    {powerStatus ? "POWER OFF" : "POWER ON"}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Current (A)</span>
                      <span className="font-mono">{currentIntensity.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <div className="bg-black w-full h-8 rounded flex items-center px-2 font-mono text-green-400 text-lg">
                        {currentIntensity.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Voltage (V)</span>
                      <span className="font-mono">{(currentIntensity * 0.24).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <div className="bg-black w-full h-8 rounded flex items-center px-2 font-mono text-green-400 text-lg">
                        {(currentIntensity * 0.24).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Control Panel */}
              <div className="bg-slate-200 rounded-md p-4 shadow-inner space-y-4">
                <h4 className="text-sm font-medium border-b pb-1">Control Panel</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="current-intensity" className="text-xs">Current Intensity</Label>
                    <span className="text-xs font-mono bg-white px-2 rounded">{currentIntensity} A</span>
                  </div>
                  <Slider
                    id="current-intensity"
                    min={10}
                    max={100}
                    step={5}
                    value={[currentIntensity]}
                    onValueChange={(value) => setCurrentIntensity(value[0])}
                    disabled={!powerStatus}
                    className={!powerStatus ? "opacity-50" : ""}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2 border-t pt-2">
                  <div className="flex items-center space-x-2">
                    <Magnet className="h-4 w-4 text-primary" />
                    <Label htmlFor="iron-core" className="text-xs">Iron Core</Label>
                  </div>
                  <Switch
                    id="iron-core"
                    checked={ironCore}
                    onCheckedChange={setIronCore}
                    disabled={!powerStatus}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <CircleDashed className="h-4 w-4 text-primary" />
                    <Label htmlFor="show-hysteresis" className="text-xs">Hysteresis Loop</Label>
                  </div>
                  <Switch
                    id="show-hysteresis"
                    checked={showHysteresis}
                    onCheckedChange={(checked) => {
                      setShowHysteresis(checked);
                      if (checked && ironCore && !cycleCompleted && powerStatus) {
                        generateHysteresisData();
                      }
                    }}
                    disabled={!ironCore || !powerStatus}
                  />
                </div>
                
                {showHysteresis && ironCore && powerStatus && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetHysteresis} 
                    className="w-full text-xs"
                  >
                    Reset Hysteresis Cycle
                  </Button>
                )}
              </div>
              
              {/* System Status */}
              <div className="bg-white border rounded-md p-4 shadow-inner">
                <h4 className="text-sm font-medium border-b pb-1">System Status</h4>
                
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Measurement Status</span>
                    </div>
                    <div className="bg-slate-100 p-2 rounded text-xs">
                      <span className={cn(
                        "font-mono",
                        measurementStatus.includes("complete") && "text-green-600",
                        measurementStatus.includes("error") && "text-red-600"
                      )}>
                        {measurementStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Coil Temperature</span>
                      <span className={cn(
                        "font-mono",
                        coilTemperature > 45 && "text-red-600",
                        coilTemperature > 35 && coilTemperature <= 45 && "text-yellow-600"
                      )}>
                        {coilTemperature.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full",
                          coilTemperature > 45 ? "bg-red-500" : 
                          coilTemperature > 35 ? "bg-yellow-500" : 
                          "bg-green-500"
                        )} 
                        style={{ width: `${(coilTemperature - 20) * 100 / 50}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>System Power</span>
                      <span className="font-mono">{powerStatus ? "ON" : "OFF"}</span>
                    </div>
                    <div className="border p-2 rounded bg-slate-100 flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${powerStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-xs font-medium">{powerStatus ? "System Active" : "System Inactive"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Oscilloscope/Chart Display */}
      <div className="bg-black p-4 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-2 text-green-500 text-xs border-b border-gray-700 pb-2">
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>B-H CURVE OSCILLOSCOPE</span>
          </div>
          <span className="font-mono">{powerStatus ? "RECORDING" : "STANDBY"}</span>
        </div>
        
        <div className={`h-[300px] ${!powerStatus && 'opacity-50 bg-gray-900'}`}>
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="h" 
                label={{ value: 'H (A/m)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'B (T)', angle: -90, position: 'insideLeft' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              
              {showHysteresis && ironCore ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="forward"
                    stroke="var(--color-forward)"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="reverse"
                    stroke="var(--color-reverse)"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="b"
                  stroke="var(--color-b)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ChartContainer>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700">
          <span>Sweep: 1s/div</span>
          <span>Sampling: 100Hz</span>
          <span>Trigger: Auto</span>
        </div>
      </div>
    </div>
  );
}
