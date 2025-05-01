
import React, { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Microscope, Diameter, Circle, CircleDashed } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';

export function NewtonRingsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const microscopeRef = useRef<HTMLCanvasElement>(null);
  const [wavelength, setWavelength] = useState(550); // Default wavelength in nm
  const [radius, setRadius] = useState(50); // Default radius of curvature in mm
  const [animate, setAnimate] = useState(false);
  const [showMicroscope, setShowMicroscope] = useState(false);
  const [ringNumber, setRingNumber] = useState<number>(5);
  const [ringDiameter, setRingDiameter] = useState<number | null>(null);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const animationRef = useRef<number | null>(null);
  const maxRings = 40; // Maximum number of rings to display

  // Calculate the positions of the newton rings
  const drawNewtonRings = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    forMicroscope: boolean = false,
    time: number = 0 
  ) => {
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * (forMicroscope ? 0.9 : 0.45);
    
    // Convert units for calculation
    const lambda = wavelength * 1e-9; // Convert nm to m
    const R = radius * 1e-3; // Convert mm to m
    
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    if (forMicroscope) {
      // Draw circular microscope view border
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#f8f9fa';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Draw crosshair for microscope view
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.stroke();
    }
    
    // Calculate ring visibility limit
    const visibleRingCount = Math.min(maxRings, Math.floor(maxRadius / 5));
    
    // Draw each ring
    const rings: number[] = []; // Store ring radii for measurement
    for (let r = maxRadius; r > 0; r -= 0.5) {
      // For each pixel, calculate the path difference and determine
      // if constructive or destructive interference occurs
      const distanceFromCenter = r / maxRadius;
      
      // Calculate the thickness of the air gap at this point
      // d = r^2 / (2R) where r is the distance from center, R is radius of curvature
      const normalizedR = distanceFromCenter * maxRadius * 1e-3; // Convert to meters
      const airGapThickness = (normalizedR * normalizedR) / (2 * R);
      
      // Phase difference: delta = 4 * pi * d / lambda
      // Additional pi/2 for reflection at glass-air boundary
      const phaseDifference = (4 * Math.PI * airGapThickness) / lambda + Math.PI;
      
      // Add time-based animation if enabled
      const animPhase = animate ? Math.sin(time / 1000) * 0.5 : 0;
      
      // Calculate intensity using the interference equation
      // I = I_max * cos^2(delta/2)
      const intensity = Math.cos((phaseDifference + animPhase) / 2) ** 2;
      
      // Map intensity to RGB color
      // We'll create a rainbow-like effect typical of Newton's Rings
      const hue = (intensity * 270) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, ${50 + intensity * 30}%)`;
      
      // Check if this is a bright ring (constructive interference)
      // and store its pixel radius for measurement
      if (intensity > 0.9 && r % 5 < 1) {
        const ringIndex = rings.length;
        if (ringIndex < maxRings) {
          rings.push(r);
        }
      }
      
      // Draw the ring as a small filled circle
      ctx.beginPath();
      ctx.arc(centerX + r * Math.cos(r), centerY + r * Math.sin(r), 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw measurement for selected ring if requested
    if (showMeasurement && forMicroscope && ringNumber > 0 && ringNumber <= rings.length) {
      const selectedRingRadius = rings[ringNumber - 1];
      
      if (selectedRingRadius) {
        // Store the calculated diameter (in pixels)
        const diameter = selectedRingRadius * 2;
        setRingDiameter(parseFloat((diameter * 0.01).toFixed(2))); // Convert to mm for display
        
        // Draw diameter line
        ctx.beginPath();
        ctx.moveTo(centerX - selectedRingRadius, centerY);
        ctx.lineTo(centerX + selectedRingRadius, centerY);
        ctx.strokeStyle = 'rgba(255,0,0,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw circle highlight
        ctx.beginPath();
        ctx.arc(centerX, centerY, selectedRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,0,0,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Label
        ctx.font = '14px Arial';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText(`Ring #${ringNumber}`, centerX, centerY - selectedRingRadius - 10);
      }
    }
    
    // Draw the center lens indicator (only on the setup view)
    if (!forMicroscope) {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Animation loop
  const animate3D = (time: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      drawNewtonRings(ctx, canvas.width, canvas.height, false, time);
    }
    
    if (microscopeRef.current && showMicroscope) {
      const microscopeCtx = microscopeRef.current.getContext('2d');
      if (microscopeCtx) {
        drawNewtonRings(microscopeCtx, microscopeRef.current.width, microscopeRef.current.height, true, time);
      }
    }
    
    if (animate) {
      animationRef.current = requestAnimationFrame(animate3D);
    }
  };

  // Set up the canvas and start/stop animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to be the same size as its display size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    if (microscopeRef.current) {
      microscopeRef.current.width = microscopeRef.current.offsetWidth;
      microscopeRef.current.height = microscopeRef.current.offsetHeight;
    }
    
    if (ctx) {
      if (animate) {
        animationRef.current = requestAnimationFrame(animate3D);
      } else {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        drawNewtonRings(ctx, canvas.width, canvas.height);
        
        if (microscopeRef.current && showMicroscope) {
          const microscopeCtx = microscopeRef.current.getContext('2d');
          if (microscopeCtx) {
            drawNewtonRings(microscopeCtx, microscopeRef.current.width, microscopeRef.current.height, true);
          }
        }
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [wavelength, radius, animate, showMicroscope, showMeasurement, ringNumber]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      if (ctx) {
        drawNewtonRings(ctx, canvas.width, canvas.height);
      }
      
      if (microscopeRef.current && showMicroscope) {
        const microscopeCtx = microscopeRef.current.getContext('2d');
        microscopeRef.current.width = microscopeRef.current.offsetWidth;
        microscopeRef.current.height = microscopeRef.current.offsetHeight;
        
        if (microscopeCtx) {
          drawNewtonRings(microscopeCtx, microscopeRef.current.width, microscopeRef.current.height, true);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showMicroscope]);

  const handleMicroscopeToggle = () => {
    setShowMicroscope(!showMicroscope);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Main experiment setup view */}
      <Card className="relative border-2 shadow-lg">
        <CardContent className="pt-6 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Experimental Setup</h3>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">
                Status: {animate ? 'Running' : 'Ready'}
              </span>
              <span className={`w-3 h-3 rounded-full ${animate ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="col-span-3 bg-gray-100 dark:bg-gray-800 rounded-md p-4 shadow-inner">
              <div className="relative">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-[220px] bg-white dark:bg-black rounded-md border"
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/80 dark:bg-black/80"
                    onClick={handleMicroscopeToggle}
                  >
                    <Microscope className="mr-1 h-4 w-4" />
                    {showMicroscope ? "Hide Microscope" : "View in Microscope"}
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Newton's Rings Apparatus - Glass Plate with Plano-Convex Lens
              </div>
            </div>
            
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-inner">
                <h4 className="text-sm font-medium mb-2">Light Source Controls</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="wavelength">Wavelength: {wavelength} nm</Label>
                      <span className="text-sm text-muted-foreground">
                        {wavelength < 450 ? 'Violet' : 
                         wavelength < 495 ? 'Blue' : 
                         wavelength < 570 ? 'Green' : 
                         wavelength < 590 ? 'Yellow' : 
                         wavelength < 620 ? 'Orange' : 'Red'}
                      </span>
                    </div>
                    <Slider
                      id="wavelength"
                      min={380}
                      max={750}
                      step={5}
                      value={[wavelength]}
                      onValueChange={(val) => setWavelength(val[0])}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-inner">
                <h4 className="text-sm font-medium mb-2">Apparatus Settings</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="radius">Radius of curvature: {radius} mm</Label>
                    <Slider
                      id="radius"
                      min={10}
                      max={100}
                      step={1}
                      value={[radius]}
                      onValueChange={(val) => setRadius(val[0])}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animate-toggle">Animate Rings:</Label>
                    <Switch
                      id="animate-toggle"
                      checked={animate}
                      onCheckedChange={setAnimate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Microscope View (conditional rendering) */}
      {showMicroscope && (
        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Microscope className="mr-2 h-5 w-5" /> 
                Microscope View
              </h3>
              <Toggle 
                pressed={showMeasurement} 
                onPressedChange={setShowMeasurement}
                aria-label="Toggle measurement"
                variant="outline"
                size="sm"
              >
                <Diameter className="mr-1 h-4 w-4" />
                Measure Ring
              </Toggle>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 bg-gray-100 dark:bg-gray-800 rounded-md p-4 shadow-inner">
                <div className="flex flex-col">
                  <canvas 
                    ref={microscopeRef} 
                    className="w-full h-[300px] bg-white dark:bg-black rounded-md border"
                  />
                </div>
              </div>
              
              {showMeasurement && (
                <div className="lg:col-span-1 flex flex-col gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-inner">
                    <h4 className="text-sm font-medium mb-3">Ring Measurement</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ring-number">Ring Number (n):</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="ring-number"
                            type="number"
                            min={1}
                            max={maxRings}
                            value={ringNumber}
                            onChange={(e) => setRingNumber(parseInt(e.target.value) || 1)}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">
                            (Max: {maxRings})
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Diameter (D<sub>n</sub>):</span>
                          <span className="font-mono text-sm">
                            {ringDiameter !== null ? `${ringDiameter} mm` : '--'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm">D<sub>n</sub><sup>2</sup>/n:</span>
                          <span className="font-mono text-sm">
                            {ringDiameter !== null 
                              ? `${((ringDiameter * ringDiameter) / ringNumber).toFixed(3)} mm²`
                              : '--'
                            }
                          </span>
                        </div>
                        
                        <div className="mt-4 text-xs text-muted-foreground">
                          <Circle className="inline-block mr-1 h-3 w-3" /> 
                          <span>D<sub>n</sub><sup>2</sup> = nλR</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          <CircleDashed className="inline-block mr-1 h-3 w-3" /> 
                          <span>R = radius of curvature</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
