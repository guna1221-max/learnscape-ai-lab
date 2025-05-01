
import React, { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Microscope, Diameter, Circle, CircleDashed, ArrowsUpFromLine } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';

export function NewtonRingsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const microscopeRef = useRef<HTMLCanvasElement>(null);
  const [wavelength, setWavelength] = useState(589); // Default sodium light wavelength in nm
  const [radius, setRadius] = useState(100); // Default radius of curvature in cm
  const [animate, setAnimate] = useState(false);
  const [showMicroscope, setShowMicroscope] = useState(false);
  const [ringNumber, setRingNumber] = useState<number>(5);
  const [ringDiameter, setRingDiameter] = useState<number | null>(null);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [lightType, setLightType] = useState<'sodium' | 'mercury' | 'custom'>('sodium');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const animationRef = useRef<number | null>(null);
  const maxRings = 40; // Maximum number of rings to display
  const ringsData = useRef<{radius: number, diameter: number}[]>([]);

  // Set wavelength based on light type
  useEffect(() => {
    switch(lightType) {
      case 'sodium':
        setWavelength(589); // Sodium D line in nm
        break;
      case 'mercury':
        setWavelength(546); // Mercury green line in nm
        break;
      // Custom wavelength is set directly by the slider
    }
  }, [lightType]);

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
    const maxRadius = Math.min(width, height) * (forMicroscope ? 0.45 : 0.35);
    
    // Convert units for calculation
    const lambda = wavelength * 1e-9; // Convert nm to m
    const R = radius * 1e-2; // Convert cm to m
    
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate microscope field of view scale
    const scale = forMicroscope ? zoomLevel : 1;
    
    if (forMicroscope) {
      // Draw circular microscope view border
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 1.75, 0, Math.PI * 2);
      ctx.fillStyle = '#f8f9fa';
      ctx.fill();
      
      // Draw crosshair for microscope view
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius * 1.75, centerY);
      ctx.lineTo(centerX + maxRadius * 1.75, centerY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - maxRadius * 1.75);
      ctx.lineTo(centerX, centerY + maxRadius * 1.75);
      ctx.stroke();
      
      // Draw scale markers
      const scaleInterval = maxRadius * 0.2;
      for (let i = 1; i <= 8; i++) {
        const markerLength = i % 5 === 0 ? 10 : 5;
        
        // Horizontal scale markers
        ctx.beginPath();
        ctx.moveTo(centerX + i * scaleInterval, centerY - markerLength);
        ctx.lineTo(centerX + i * scaleInterval, centerY + markerLength);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX - i * scaleInterval, centerY - markerLength);
        ctx.lineTo(centerX - i * scaleInterval, centerY + markerLength);
        ctx.stroke();
        
        // Vertical scale markers
        ctx.beginPath();
        ctx.moveTo(centerX - markerLength, centerY + i * scaleInterval);
        ctx.lineTo(centerX + markerLength, centerY + i * scaleInterval);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX - markerLength, centerY - i * scaleInterval);
        ctx.lineTo(centerX + markerLength, centerY - i * scaleInterval);
        ctx.stroke();
        
        // Add label for every 5th marker
        if (i % 5 === 0) {
          ctx.font = '10px Arial';
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.textAlign = 'center';
          ctx.fillText(`${i}`, centerX + i * scaleInterval, centerY + markerLength + 12);
          ctx.fillText(`${i}`, centerX - i * scaleInterval, centerY + markerLength + 12);
        }
      }
    } else {
      // Draw apparatus for non-microscope view
      // Draw plano-convex lens
      const lensThickness = maxRadius * 0.2;
      const lensWidth = maxRadius * 0.8;
      
      // Draw lens holder
      ctx.fillStyle = '#777';
      ctx.beginPath();
      ctx.rect(centerX - lensWidth * 0.6, centerY - lensThickness - 20, lensWidth * 1.2, 20);
      ctx.fill();
      
      // Draw lens
      ctx.fillStyle = 'rgba(200, 220, 255, 0.8)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - lensThickness, lensWidth / 2, lensThickness, 0, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
      ctx.stroke();
      
      // Draw glass plate
      ctx.fillStyle = 'rgba(200, 220, 255, 0.4)';
      ctx.beginPath();
      ctx.rect(centerX - lensWidth - 20, centerY, lensWidth * 2 + 40, 5);
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.stroke();
      
      // Draw support
      ctx.fillStyle = '#555';
      ctx.beginPath();
      ctx.rect(centerX - lensWidth - 40, centerY + 5, lensWidth * 2 + 80, 15);
      ctx.fill();
      
      // Draw sodium light source
      const lightSourceSize = 30;
      ctx.fillStyle = lightType === 'sodium' ? '#ffcc00' : 
                      lightType === 'mercury' ? '#ccffcc' : '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY - lensThickness - 80, lightSourceSize / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw light rays
      ctx.strokeStyle = lightType === 'sodium' ? 'rgba(255, 204, 0, 0.3)' : 
                        lightType === 'mercury' ? 'rgba(204, 255, 204, 0.3)' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      for (let angle = -Math.PI/3; angle <= Math.PI/3; angle += Math.PI/15) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - lensThickness - 80);
        ctx.lineTo(centerX + 200 * Math.sin(angle), centerY + 200 * Math.cos(angle));
        ctx.stroke();
      }
      
      // Add text labels
      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText('Sodium Light', centerX, centerY - lensThickness - 100);
      ctx.fillText('Plano-convex Lens', centerX, centerY - lensThickness - 30);
      ctx.fillText('Glass Plate', centerX, centerY + 30);
    }
    
    // Get the actual rings data with physical calculations
    ringsData.current = [];
    
    // Clear the rings array
    const rings: number[] = [];
    
    // Create Newton's Rings
    // Newton's rings are formed by interference of light reflected from air gap
    for (let m = 1; m <= maxRings; m++) {
      // For constructive interference (bright rings): 2d = (m-1/2)λ
      // For destructive interference (dark rings): 2d = mλ
      // Air gap thickness d = r²/2R where R is the radius of curvature
      
      // Calculate radius of dark rings (destructive interference)
      // r² = mλR, where r is the radius of the mth dark ring
      // For reflection from an air film, the condition for dark fringes
      const ringRadius = Math.sqrt(m * lambda * R);
      
      // Convert radius from meters to pixels for display
      const pixelRadius = (ringRadius / (0.01 * R)) * maxRadius * scale; // Scaling factor
      
      // Store ring data for measurement
      if (m <= maxRings) {
        const physicalDiameter = 2 * ringRadius * 1000; // Convert to mm
        ringsData.current.push({
          radius: pixelRadius,
          diameter: physicalDiameter
        });
        rings.push(pixelRadius);
      }
    }
    
    // First draw darker rings (to appear behind the brighter ones)
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      if (r <= maxRadius * 1.8) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.stroke();
      }
    }
    
    // Then draw brighter rings with slight spacing
    for (let i = 0; i < rings.length; i += 2) {
      const r = rings[i];
      if (r <= maxRadius * 1.8 && r > 0) {
        const colorIntensity = Math.min(0.9, 1 - i / (rings.length));
        
        // Create rainbow-like effect for white light, or specific color for monochromatic light
        let ringColor;
        if (lightType === 'sodium') {
          ringColor = `rgba(255, 204, 0, ${colorIntensity})`;
        } else if (lightType === 'mercury') {
          ringColor = `rgba(100, 255, 150, ${colorIntensity})`;
        } else {
          // Custom wavelength - map to approximate color
          const hue = Math.max(0, Math.min(270, (wavelength - 380) * 270 / (750 - 380)));
          ringColor = `hsla(${hue}, 100%, 60%, ${colorIntensity})`;
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, r - 0.5, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = ringColor;
        ctx.stroke();
      }
    }
    
    // Draw central spot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fill();
    
    // Draw measurement for selected ring if requested
    if (showMeasurement && forMicroscope && ringNumber > 0 && ringNumber <= rings.length) {
      const selectedRingIndex = ringNumber - 1;
      const selectedRingRadius = rings[selectedRingIndex];
      
      if (selectedRingRadius) {
        const ringData = ringsData.current[selectedRingIndex];
        if (ringData) {
          // Store the calculated diameter (in mm)
          setRingDiameter(parseFloat(ringData.diameter.toFixed(3)));
          
          // Draw diameter line
          ctx.beginPath();
          ctx.moveTo(centerX - selectedRingRadius, centerY);
          ctx.lineTo(centerX + selectedRingRadius, centerY);
          ctx.strokeStyle = 'rgba(255,50,50,0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw circle highlight
          ctx.beginPath();
          ctx.arc(centerX, centerY, selectedRingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,50,50,0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // Label
          ctx.font = '14px Arial';
          ctx.fillStyle = 'red';
          ctx.textAlign = 'center';
          ctx.fillText(`Ring #${ringNumber}`, centerX, centerY - selectedRingRadius - 10);
        }
      }
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
  }, [wavelength, radius, animate, showMicroscope, showMeasurement, ringNumber, lightType, zoomLevel]);

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
    if (!showMicroscope) {
      setShowMeasurement(false);
    }
  };

  const calculateWavelength = () => {
    if (ringDiameter && ringNumber) {
      // Using formula: λ = D²n/(4Rn)
      // Where Dn is diameter of nth ring, R is radius of curvature
      const Dn_squared = ringDiameter * ringDiameter; // mm²
      const R = radius * 10; // Convert cm to mm
      const n = ringNumber;
      
      const calculatedWavelength = (Dn_squared)/(4 * R * n) * 1000000; // Convert to nm
      return calculatedWavelength.toFixed(2);
    }
    return "N/A";
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Main experiment setup view */}
      <Card className="relative border-2 shadow-lg">
        <CardContent className="pt-6 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Newton's Rings Experiment</h3>
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
                Newton's Rings Apparatus - Plano-convex lens on optical glass plate
              </div>
            </div>
            
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-inner">
                <h4 className="text-sm font-medium mb-2">Light Source Controls</h4>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge 
                      variant={lightType === 'sodium' ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setLightType('sodium')}
                    >
                      Sodium Light (589 nm)
                    </Badge>
                    <Badge 
                      variant={lightType === 'mercury' ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setLightType('mercury')}
                    >
                      Mercury Light (546 nm)
                    </Badge>
                    <Badge 
                      variant={lightType === 'custom' ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setLightType('custom')}
                    >
                      Custom
                    </Badge>
                  </div>
                  
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
                      step={1}
                      value={[wavelength]}
                      onValueChange={(val) => {
                        setLightType('custom');
                        setWavelength(val[0]);
                      }}
                      disabled={lightType !== 'custom'}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-inner">
                <h4 className="text-sm font-medium mb-2">Apparatus Settings</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="radius">Radius of curvature: {radius} cm</Label>
                    <Slider
                      id="radius"
                      min={10}
                      max={200}
                      step={5}
                      value={[radius]}
                      onValueChange={(val) => setRadius(val[0])}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animate-toggle">Simulate Lens Pressure:</Label>
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
                Traveling Microscope View
              </h3>
              <div className="flex items-center gap-2">
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
                
                <div className="flex gap-1 items-center border rounded-md p-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
                    disabled={zoomLevel <= 0.5}
                  >
                    -
                  </Button>
                  <span className="flex items-center text-xs">
                    <ArrowsUpFromLine className="h-3 w-3 mr-1" /> {(zoomLevel * 100).toFixed(0)}%
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
                    disabled={zoomLevel >= 2}
                  >
                    +
                  </Button>
                </div>
              </div>
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
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <Diameter className="mr-1 h-4 w-4" /> Ring Measurement
                    </h4>
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
                            {ringDiameter !== null ? `${ringDiameter.toFixed(3)} mm` : '--'}
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
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm">λ (calculated):</span>
                          <span className="font-mono text-sm">
                            {ringDiameter !== null ? `${calculateWavelength()} nm` : '--'}
                          </span>
                        </div>
                        
                        <div className="mt-4 text-xs text-muted-foreground">
                          <Circle className="inline-block mr-1 h-3 w-3" /> 
                          <span>D<sub>n</sub><sup>2</sup> = 4nλR</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          <CircleDashed className="inline-block mr-1 h-3 w-3" /> 
                          <span>λ = D<sub>n</sub><sup>2</sup>/(4Rn)</span>
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
