
import React, { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function NewtonRingsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wavelength, setWavelength] = useState(550); // Default wavelength in nm
  const [radius, setRadius] = useState(50); // Default radius of curvature in mm
  const [animate, setAnimate] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Calculate the positions of the newton rings
  const drawNewtonRings = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    time: number = 0 
  ) => {
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;
    
    // Convert units for calculation
    const lambda = wavelength * 1e-9; // Convert nm to m
    const R = radius * 1e-3; // Convert mm to m
    
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Draw each ring
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
      
      // Draw the ring as a small filled circle
      ctx.beginPath();
      ctx.arc(centerX + r * Math.cos(r), centerY + r * Math.sin(r), 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw the center lens indicator
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  // Animation loop
  const animate3D = (time: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      drawNewtonRings(ctx, canvas.width, canvas.height, time);
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
    
    if (ctx) {
      if (animate) {
        animationRef.current = requestAnimationFrame(animate3D);
      } else {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        drawNewtonRings(ctx, canvas.width, canvas.height);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [wavelength, radius, animate]);

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
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <Card className="relative">
        <CardContent className="pt-6">
          <canvas 
            ref={canvasRef} 
            className="w-full h-[300px] bg-gray-50 dark:bg-gray-900 rounded-md"
          />
        </CardContent>
      </Card>
      
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
        
        <Button 
          variant={animate ? "destructive" : "default"}
          onClick={() => setAnimate(!animate)}
          className="w-full"
        >
          {animate ? "Stop Animation" : "Start Animation"}
        </Button>
      </div>
    </div>
  );
}
