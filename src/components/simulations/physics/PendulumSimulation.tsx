
import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function PendulumSimulation() {
  const [angle, setAngle] = useState<number>(30);
  const [length, setLength] = useState<number>(150);
  const [gravity, setGravity] = useState<number>(9.8);
  const [damping, setDamping] = useState<number>(0.999);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Physics state
  const physicsRef = useRef({
    theta: Math.PI * angle / 180,
    dTheta: 0,
    ddTheta: 0,
    lastTime: 0,
  });
  
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };
  
  const resetSimulation = () => {
    setIsRunning(false);
    physicsRef.current = {
      theta: Math.PI * angle / 180,
      dTheta: 0,
      ddTheta: 0,
      lastTime: 0,
    };
    if (canvasRef.current) {
      drawPendulum();
    }
  };

  // Initialize the canvas
  useEffect(() => {
    drawPendulum();
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Handle parameter changes
  useEffect(() => {
    physicsRef.current.theta = Math.PI * angle / 180;
    drawPendulum();
  }, [angle, length]);
  
  // Animation loop
  useEffect(() => {
    if (isRunning) {
      physicsRef.current.lastTime = performance.now();
      animationRef.current = requestAnimationFrame(updatePhysics);
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, gravity, damping]);
  
  // Update physics and render
  const updatePhysics = (timestamp: number) => {
    const dt = (timestamp - physicsRef.current.lastTime) / 1000; // convert to seconds
    physicsRef.current.lastTime = timestamp;
    
    // Calculate acceleration: a = -g/L * sin(θ)
    physicsRef.current.ddTheta = -gravity / (length / 100) * Math.sin(physicsRef.current.theta);
    
    // Update velocity and position
    physicsRef.current.dTheta += physicsRef.current.ddTheta * dt;
    physicsRef.current.dTheta *= damping; // Apply damping
    physicsRef.current.theta += physicsRef.current.dTheta * dt;
    
    // Draw the updated pendulum
    drawPendulum();
    
    // Continue animation
    animationRef.current = requestAnimationFrame(updatePhysics);
  };
  
  // Draw pendulum on canvas
  const drawPendulum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const pivotX = canvas.width / 2;
    const pivotY = 50;
    const bob_radius = 20;
    
    // Calculate bob position
    const bobX = pivotX + length * Math.sin(physicsRef.current.theta);
    const bobY = pivotY + length * Math.cos(physicsRef.current.theta);
    
    // Draw pendulum rod
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw pivot point
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    
    // Draw pendulum bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, bob_radius, 0, Math.PI * 2);
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw angle indicator
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX + 40, pivotY);
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX + 40 * Math.sin(physicsRef.current.theta), 
               pivotY + 40 * Math.cos(physicsRef.current.theta));
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.stroke();
    
    // Draw angle value text
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    const angleText = (physicsRef.current.theta * 180 / Math.PI).toFixed(1) + '°';
    ctx.fillText(angleText, pivotX + 45, pivotY + 5);
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="relative border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300}
          className="w-full"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant={isRunning ? "destructive" : "default"}
          onClick={toggleSimulation}
          className="flex-1"
        >
          {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button 
          variant="outline" 
          onClick={resetSimulation}
          className="flex-1"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Initial Angle: {angle}°</label>
          </div>
          <Slider 
            value={[angle]} 
            min={0} 
            max={90} 
            step={1}
            onValueChange={(value) => setAngle(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Length: {length} cm</label>
          </div>
          <Slider 
            value={[length]} 
            min={50} 
            max={250} 
            step={10}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Gravity: {gravity} m/s²</label>
          </div>
          <Slider 
            value={[gravity]} 
            min={1} 
            max={20} 
            step={0.1}
            onValueChange={(value) => setGravity(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Damping: {(1 - damping).toFixed(3)}</label>
          </div>
          <Slider 
            value={[damping * 1000]} 
            min={980} 
            max={1000} 
            step={1}
            onValueChange={(value) => setDamping(value[0] / 1000)}
          />
        </div>
      </div>
    </div>
  );
}
