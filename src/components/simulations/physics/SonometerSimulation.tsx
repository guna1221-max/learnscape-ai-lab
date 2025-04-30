
import React, { useRef, useEffect, useState } from 'react';

export function SonometerSimulation({ isRunning = false, onReset }: { isRunning?: boolean, onReset?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [amplitude, setAmplitude] = useState(0.5);
  const [frequency, setFrequency] = useState(2);
  const [stringTension, setStringTension] = useState(5);
  const animationRef = useRef<number | null>(null);
  const [time, setTime] = useState(0);
  
  // Handle simulation reset
  useEffect(() => {
    if (onReset) {
      const handleReset = () => {
        setTime(0);
        setAmplitude(0.5);
        setFrequency(2);
        setStringTension(5);
      };
      
      onReset(handleReset);
    }
  }, [onReset]);
  
  // Animation loop
  useEffect(() => {
    let lastTime = 0;
    const fps = 60;
    const frameTime = 1000 / fps;
    
    const animate = (timestamp: number) => {
      if (timestamp - lastTime >= frameTime) {
        setTime(prev => prev + 0.02);
        lastTime = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);
  
  // Draw the sonometer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the sonometer base
    ctx.fillStyle = '#8B4513'; // Wood color
    ctx.fillRect(50, canvas.height - 70, canvas.width - 100, 20);
    
    // Draw the sonometer string
    const startX = 80;
    const endX = canvas.width - 80;
    const centerY = canvas.height - 100;
    const stringLength = endX - startX;
    
    // Calculate wave parameters based on user settings
    const calculatedFrequency = frequency * Math.sqrt(stringTension);
    
    // Draw string as a standing wave
    ctx.beginPath();
    ctx.moveTo(startX, centerY);
    
    for (let x = 0; x <= stringLength; x++) {
      const relativeX = x / stringLength;
      const waveY = amplitude * 20 * Math.sin(calculatedFrequency * Math.PI * relativeX) * 
                    Math.sin(calculatedFrequency * 6 * time);
      ctx.lineTo(startX + x, centerY + waveY);
    }
    
    ctx.strokeStyle = isRunning ? '#FFD700' : '#888888'; // Gold when vibrating
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw fixed bridges
    ctx.fillStyle = '#333';
    ctx.fillRect(startX - 5, centerY - 15, 10, 30);
    ctx.fillRect(endX - 5, centerY - 15, 10, 30);
    
    // Draw movable bridge
    const movableBridgeX = startX + stringLength * 0.6;
    ctx.fillStyle = '#555';
    ctx.fillRect(movableBridgeX - 4, centerY - 12, 8, 25);
    
    // Draw weight
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(endX + 20, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw scale markings
    ctx.fillStyle = '#333';
    for (let i = 0; i <= 10; i++) {
      const markX = startX + (stringLength * i / 10);
      ctx.fillRect(markX, canvas.height - 60, 1, 10);
      
      if (i % 2 === 0) {
        ctx.fillText(`${i * 10}`, markX - 5, canvas.height - 40);
      }
    }
    
  }, [time, amplitude, frequency, stringTension, isRunning]);
  
  return (
    <div className="flex flex-col gap-4">
      <div className="relative border rounded-md overflow-hidden bg-background">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={250} 
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Amplitude: {amplitude.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Frequency: {frequency.toFixed(1)} Hz
          </label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            String Tension: {stringTension.toFixed(1)} N
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.2"
            value={stringTension}
            onChange={(e) => setStringTension(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
