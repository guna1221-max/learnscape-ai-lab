
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'water' | 'sodium' | 'potassium' | 'glucose';
}

export function CellSimulation() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [concentration, setConcentration] = useState<number>(50);
  const [temperature, setTemperature] = useState<number>(37);
  const [zoom, setZoom] = useState<number>(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  
  const membraneThickness = 20;
  const particleTypes = {
    water: { radius: 3, color: '#3B82F6', speed: 1.0 },
    sodium: { radius: 5, color: '#10B981', speed: 0.7 },
    potassium: { radius: 6, color: '#6366F1', speed: 0.6 },
    glucose: { radius: 8, color: '#F59E0B', speed: 0.4 }
  };
  
  // Initialize simulation
  useEffect(() => {
    initializeParticles();
    drawCell();
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Handle concentration changes
  useEffect(() => {
    initializeParticles();
    drawCell();
  }, [concentration]);
  
  // Handle animation state
  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, temperature, zoom]);
  
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };
  
  const resetSimulation = () => {
    setIsRunning(false);
    initializeParticles();
    drawCell();
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2.0));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  };
  
  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const particleCount = concentration * 2;
    const particles: Particle[] = [];
    
    // Function to check if a new particle overlaps with existing ones
    const checkOverlap = (x: number, y: number, radius: number) => {
      for (const particle of particles) {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < particle.radius + radius) {
          return true;
        }
      }
      return false;
    };
    
    // Calculate membrane boundaries
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const cellRadius = Math.min(canvas.width, canvas.height) / 2 - membraneThickness;
    
    // Create particles
    // Distribution: 60% water, 15% sodium, 15% potassium, 10% glucose
    for (let i = 0; i < particleCount; i++) {
      let type: 'water' | 'sodium' | 'potassium' | 'glucose';
      const random = Math.random();
      
      if (random < 0.6) {
        type = 'water';
      } else if (random < 0.75) {
        type = 'sodium';
      } else if (random < 0.9) {
        type = 'potassium';
      } else {
        type = 'glucose';
      }
      
      const { radius, color, speed } = particleTypes[type];
      
      // Randomly position inside cell
      let x, y, isInside;
      let attempts = 0;
      
      do {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (cellRadius - radius * 2);
        
        x = centerX + Math.cos(angle) * distance;
        y = centerY + Math.sin(angle) * distance;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        
        isInside = distanceFromCenter + radius < cellRadius;
        attempts++;
      } while ((checkOverlap(x, y, radius) || !isInside) && attempts < 100);
      
      if (attempts < 100) {
        // Random velocity based on temperature
        const speedFactor = speed * (temperature / 37);
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * speedFactor + 0.1;
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          radius,
          color,
          type
        });
      }
    }
    
    particlesRef.current = particles;
  };
  
  const updateSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate membrane boundaries
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const cellRadius = Math.min(canvas.width, canvas.height) / 2 - membraneThickness;
    
    // Update particles
    for (const particle of particlesRef.current) {
      // Apply velocity
      particle.x += particle.vx * (temperature / 30);
      particle.y += particle.vy * (temperature / 30);
      
      // Calculate distance from center
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
      
      // Handle collisions with membrane
      if (distanceFromCenter + particle.radius > cellRadius) {
        // If particle is small (water) and velocity is high enough, sometimes allow it through the membrane
        if (particle.type === 'water' && Math.random() < 0.02) {
          // Allow it to pass through
        } else {
          // Calculate bounce angle
          const angle = Math.atan2(dy, dx);
          
          // Place particle at boundary
          particle.x = centerX + Math.cos(angle) * (cellRadius - particle.radius);
          particle.y = centerY + Math.sin(angle) * (cellRadius - particle.radius);
          
          // Calculate reflection vector
          const dot = particle.vx * Math.cos(angle) + particle.vy * Math.sin(angle);
          particle.vx -= 2 * dot * Math.cos(angle);
          particle.vy -= 2 * dot * Math.sin(angle);
          
          // Add some energy loss on collision
          particle.vx *= 0.9;
          particle.vy *= 0.9;
        }
      }
      
      // Handle collisions with other particles (simplified)
      for (const otherParticle of particlesRef.current) {
        if (particle === otherParticle) continue;
        
        const dx = otherParticle.x - particle.x;
        const dy = otherParticle.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < particle.radius + otherParticle.radius) {
          // Simple elastic collision
          const angle = Math.atan2(dy, dx);
          
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);
          
          // Rotate velocity vectors
          const vx1 = particle.vx * cos + particle.vy * sin;
          const vy1 = particle.vy * cos - particle.vx * sin;
          const vx2 = otherParticle.vx * cos + otherParticle.vy * sin;
          const vy2 = otherParticle.vy * cos - otherParticle.vx * sin;
          
          // Calculate new velocities
          const newVx1 = ((particle.radius - otherParticle.radius) * vx1 + 2 * otherParticle.radius * vx2) / 
                         (particle.radius + otherParticle.radius);
          const newVx2 = ((otherParticle.radius - particle.radius) * vx2 + 2 * particle.radius * vx1) / 
                         (particle.radius + otherParticle.radius);
          
          // Update velocities
          particle.vx = newVx1 * cos - vy1 * sin;
          particle.vy = vy1 * cos + newVx1 * sin;
          otherParticle.vx = newVx2 * cos - vy2 * sin;
          otherParticle.vy = vy2 * cos + newVx2 * sin;
          
          // Move particles apart to prevent sticking
          const overlap = particle.radius + otherParticle.radius - distance;
          const moveX = overlap * dx / distance / 2;
          const moveY = overlap * dy / distance / 2;
          
          particle.x -= moveX;
          particle.y -= moveY;
          otherParticle.x += moveX;
          otherParticle.y += moveY;
        }
      }
    }
    
    // Draw the updated cell
    drawCell();
    
    // Continue animation
    animationRef.current = requestAnimationFrame(updateSimulation);
  };
  
  const drawCell = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Apply zoom
    ctx.save();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) / 2;
    
    // Draw cell membrane (gradient)
    const gradient = ctx.createRadialGradient(
      centerX, centerY, baseRadius - membraneThickness,
      centerX, centerY, baseRadius
    );
    gradient.addColorStop(0, 'rgba(244, 114, 182, 0.6)'); // Pink inside
    gradient.addColorStop(1, 'rgba(244, 114, 182, 0.2)'); // Transparent outside
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, baseRadius - membraneThickness, 0, Math.PI * 2, true);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw cytoplasm background
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius - membraneThickness, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(219, 234, 254, 0.1)'; // Very light blue
    ctx.fill();
    
    // Draw particles
    for (const particle of particlesRef.current) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * zoom, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    }
    
    ctx.restore();
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
      
      <div className="flex space-x-2">
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="flex-1 text-center text-sm">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Particle Concentration: {concentration}</label>
          </div>
          <Slider 
            value={[concentration]} 
            min={10} 
            max={100} 
            step={10}
            onValueChange={(value) => setConcentration(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Temperature: {temperature}°C</label>
          </div>
          <Slider 
            value={[temperature]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(value) => setTemperature(value[0])}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
          <span className="text-xs">Water</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
          <span className="text-xs">Sodium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6366F1]"></div>
          <span className="text-xs">Potassium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
          <span className="text-xs">Glucose</span>
        </div>
      </div>
    </div>
  );
}
