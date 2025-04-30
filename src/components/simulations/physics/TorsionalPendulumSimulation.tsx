
import React, { useState, useEffect, useRef } from 'react';
import { SimulationController } from '@/components/simulations/SimulationController';
import { Slider } from '@/components/ui/slider';

export function TorsionalPendulumSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [momentOfInertia, setMomentOfInertia] = useState(2); // kg·m²
  const [torsionalConstant, setTorsionalConstant] = useState(5); // N·m/rad
  const [dampingCoefficient, setDampingCoefficient] = useState(0.2); // kg·m²/s
  const [initialAngle, setInitialAngle] = useState(30); // degrees
  
  // Simulation state variables
  const [time, setTime] = useState(0);
  const [angle, setAngle] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const pendulumData = useRef({
    time: 0,
    angle: 0,
    angularVelocity: 0,
    lastTimestamp: 0
  });

  // Calculate period of oscillation
  const period = 2 * Math.PI * Math.sqrt(momentOfInertia / torsionalConstant);
  const frequency = 1 / period;
  
  // Initialize simulation
  useEffect(() => {
    resetSimulation();
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [momentOfInertia, torsionalConstant, dampingCoefficient, initialAngle]);
  
  const resetSimulation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const initialAngleRadians = (initialAngle * Math.PI) / 180;
    
    pendulumData.current = {
      time: 0,
      angle: initialAngleRadians,
      angularVelocity: 0,
      lastTimestamp: 0
    };
    
    setTime(0);
    setAngle(initialAngleRadians);
    setAngularVelocity(0);
    
    // Draw initial state
    drawPendulum(initialAngleRadians);
  };
  
  // Start/stop simulation
  const toggleSimulation = () => {
    if (isRunning) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    } else {
      pendulumData.current.lastTimestamp = performance.now();
      animationRef.current = requestAnimationFrame(updateSimulation);
    }
    
    setIsRunning(!isRunning);
  };
  
  // Update simulation state
  const updateSimulation = (timestamp: number) => {
    if (!canvasRef.current) return;
    
    // Calculate time step
    const dt = pendulumData.current.lastTimestamp === 0 ? 
      0 : (timestamp - pendulumData.current.lastTimestamp) / 1000; // convert to seconds
    
    // Don't update on first frame
    if (dt > 0) {
      // Torsional pendulum differential equation:
      // I * d²θ/dt² + c * dθ/dt + κ * θ = 0
      
      // Calculate angular acceleration
      const angularAcceleration = (
        -torsionalConstant * pendulumData.current.angle - 
        dampingCoefficient * pendulumData.current.angularVelocity
      ) / momentOfInertia;
      
      // Update angular velocity (using Euler's method)
      pendulumData.current.angularVelocity += angularAcceleration * dt;
      
      // Update angle (using Euler's method)
      pendulumData.current.angle += pendulumData.current.angularVelocity * dt;
      
      // Update time
      pendulumData.current.time += dt;
      
      // Update state for display
      setTime(pendulumData.current.time);
      setAngle(pendulumData.current.angle);
      setAngularVelocity(pendulumData.current.angularVelocity);
      
      // Draw pendulum
      drawPendulum(pendulumData.current.angle);
    }
    
    pendulumData.current.lastTimestamp = timestamp;
    
    // Continue animation loop
    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    }
  };
  
  // Draw pendulum on canvas
  const drawPendulum = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw fixed support (vertical line)
    const supportHeight = canvas.height * 0.2;
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.moveTo(centerX, centerY - supportHeight);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
    
    // Draw wire (vertical line)
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + 10);
    ctx.stroke();
    
    // Draw disk
    const diskRadius = Math.min(canvas.width, canvas.height) * 0.2;
    
    // Transformation matrix to rotate the disk
    ctx.save();
    ctx.translate(centerX, centerY + diskRadius);
    
    // Draw circular disk
    ctx.beginPath();
    ctx.arc(0, 0, diskRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw radial line to show rotation
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -diskRadius);
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add a small circle at the end of the radial line
    ctx.beginPath();
    ctx.arc(0, -diskRadius, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff3333';
    ctx.fill();
    
    ctx.restore();
  };
  
  useEffect(() => {
    // Ensure canvas is properly sized
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          canvasRef.current.width = width;
          canvasRef.current.height = height;
          drawPendulum(pendulumData.current.angle);
        }
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border rounded-lg p-4 h-[400px] w-full relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
      <SimulationController
        isRunning={isRunning}
        onToggle={toggleSimulation}
        onReset={resetSimulation}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Moment of Inertia (I): {momentOfInertia.toFixed(2)} kg·m²</label>
              <span className="text-sm text-muted-foreground">0.5 - 5.0</span>
            </div>
            <Slider 
              min={0.5} 
              max={5.0} 
              step={0.1} 
              value={[momentOfInertia]} 
              onValueChange={(val) => setMomentOfInertia(val[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Torsional Constant (κ): {torsionalConstant.toFixed(2)} N·m/rad</label>
              <span className="text-sm text-muted-foreground">1.0 - 10.0</span>
            </div>
            <Slider 
              min={1.0} 
              max={10.0} 
              step={0.1} 
              value={[torsionalConstant]} 
              onValueChange={(val) => setTorsionalConstant(val[0])} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Damping Coefficient (c): {dampingCoefficient.toFixed(2)} kg·m²/s</label>
              <span className="text-sm text-muted-foreground">0.0 - 1.0</span>
            </div>
            <Slider 
              min={0.0} 
              max={1.0} 
              step={0.01} 
              value={[dampingCoefficient]} 
              onValueChange={(val) => setDampingCoefficient(val[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Initial Angle: {initialAngle.toFixed(0)}°</label>
              <span className="text-sm text-muted-foreground">0° - 180°</span>
            </div>
            <Slider 
              min={0} 
              max={180} 
              step={1} 
              value={[initialAngle]} 
              onValueChange={(val) => setInitialAngle(val[0])} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="bg-muted rounded-md p-3">
          <div className="text-sm font-medium">Angle</div>
          <div className="text-lg">{((angle * 180) / Math.PI).toFixed(1)}°</div>
        </div>
        <div className="bg-muted rounded-md p-3">
          <div className="text-sm font-medium">Angular Velocity</div>
          <div className="text-lg">{angularVelocity.toFixed(2)} rad/s</div>
        </div>
        <div className="bg-muted rounded-md p-3">
          <div className="text-sm font-medium">Period</div>
          <div className="text-lg">{period.toFixed(2)} s</div>
        </div>
        <div className="bg-muted rounded-md p-3">
          <div className="text-sm font-medium">Frequency</div>
          <div className="text-lg">{frequency.toFixed(2)} Hz</div>
        </div>
      </div>
    </div>
  );
}
