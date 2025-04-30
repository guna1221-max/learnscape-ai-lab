
import React, { useEffect, useRef } from 'react';

interface SonometerSimulationProps {
  isRunning?: boolean;
}

export function SonometerSimulation({ isRunning = false }: SonometerSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Animation variables
  const stringAmplitude = useRef(5);
  const stringFrequency = useRef(2);
  const time = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Initial render
    drawSonometer(ctx, canvas.width, canvas.height, 0);
    
    // Start or stop animation based on isRunning prop
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      // Reset to initial position
      drawSonometer(ctx, canvas.width, canvas.height, 0);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning]);
  
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update time
    time.current += 0.05;
    
    // Draw sonometer
    drawSonometer(ctx, canvas.width, canvas.height, time.current);
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const drawSonometer = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ) => {
    // Draw sonometer box
    const boxHeight = height * 0.3;
    const boxWidth = width * 0.8;
    const boxX = width * 0.1;
    const boxY = height * 0.5;
    
    // Draw box
    ctx.fillStyle = '#8B5CF6';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxWidth, boxHeight);
    ctx.stroke();
    ctx.fillStyle = '#f3f4f6';
    ctx.fill();
    
    // Draw bridges
    const bridge1X = boxX + boxWidth * 0.2;
    const bridge2X = boxX + boxWidth * 0.8;
    const bridgeWidth = 10;
    const bridgeHeight = 20;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(bridge1X - bridgeWidth/2, boxY - bridgeHeight/2, bridgeWidth, bridgeHeight);
    ctx.fillRect(bridge2X - bridgeWidth/2, boxY - bridgeHeight/2, bridgeWidth, bridgeHeight);
    
    // Draw vibrating string
    ctx.beginPath();
    ctx.moveTo(bridge1X, boxY);
    
    // Draw string with sine wave
    for (let x = bridge1X; x <= bridge2X; x++) {
      const normalizedX = (x - bridge1X) / (bridge2X - bridge1X);
      const y = boxY - stringAmplitude.current * Math.sin(normalizedX * Math.PI * stringFrequency.current) * Math.sin(time * 5);
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Draw weights
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.arc(boxX + boxWidth * 0.95, boxY + boxHeight * 0.5, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <canvas 
        ref={canvasRef}
        className="border rounded-lg w-full" 
        style={{ height: '300px' }}
      />
    </div>
  );
}
