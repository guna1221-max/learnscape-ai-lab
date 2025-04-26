
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Beaker, 
  Thermometer, 
  Play, 
  Pause, 
  RotateCcw 
} from 'lucide-react';

interface Molecule {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'reactant1' | 'reactant2' | 'product';
  reacted: boolean;
}

export function ChemicalReactionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [temperature, setTemperature] = useState(25); // in Celsius
  const [reactionRate, setReactionRate] = useState(0.01);
  const [moleculeCount, setMoleculeCount] = useState(50);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [productCount, setProductCount] = useState(0);
  
  // Initialize molecules
  useEffect(() => {
    resetSimulation();
  }, [moleculeCount]);

  const resetSimulation = () => {
    const initialMolecules: Molecule[] = [];
    
    // Create reactant molecules
    for (let i = 0; i < moleculeCount; i++) {
      initialMolecules.push({
        id: i,
        x: Math.random() * 400,
        y: Math.random() * 300,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type: i % 2 === 0 ? 'reactant1' : 'reactant2',
        reacted: false
      });
    }
    
    setMolecules(initialMolecules);
    setProductCount(0);
    setIsRunning(false);
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate temperature influence on speed
      const speedFactor = 1 + (temperature - 25) / 75;
      
      // Update molecule positions and check for reactions
      const updatedMolecules = [...molecules];
      let newProductCount = productCount;
      
      for (let i = 0; i < updatedMolecules.length; i++) {
        const molecule = updatedMolecules[i];
        
        // Update position
        molecule.x += molecule.vx * speedFactor;
        molecule.y += molecule.vy * speedFactor;
        
        // Boundary collision
        if (molecule.x < 10 || molecule.x > canvas.width - 10) {
          molecule.vx = -molecule.vx;
        }
        if (molecule.y < 10 || molecule.y > canvas.height - 10) {
          molecule.vy = -molecule.vy;
        }
        
        // Check for reactions between reactant1 and reactant2
        if (!molecule.reacted && molecule.type === 'reactant1') {
          for (let j = 0; j < updatedMolecules.length; j++) {
            const otherMolecule = updatedMolecules[j];
            if (!otherMolecule.reacted && otherMolecule.type === 'reactant2') {
              const dx = molecule.x - otherMolecule.x;
              const dy = molecule.y - otherMolecule.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 15) {
                // React with probability based on temperature and reaction rate
                const reactionProbability = reactionRate * speedFactor;
                if (Math.random() < reactionProbability) {
                  // Mark both molecules as reacted
                  molecule.reacted = true;
                  otherMolecule.reacted = true;
                  
                  // Create a product molecule at the midpoint
                  updatedMolecules.push({
                    id: updatedMolecules.length,
                    x: (molecule.x + otherMolecule.x) / 2,
                    y: (molecule.y + otherMolecule.y) / 2,
                    vx: (molecule.vx + otherMolecule.vx) / 2,
                    vy: (molecule.vy + otherMolecule.vy) / 2,
                    type: 'product',
                    reacted: false
                  });
                  
                  newProductCount++;
                  break;
                }
              }
            }
          }
        }

        // Draw molecule
        ctx.beginPath();
        if (molecule.type === 'reactant1') {
          ctx.fillStyle = '#FF5555';
        } else if (molecule.type === 'reactant2') {
          ctx.fillStyle = '#5555FF';
        } else {
          ctx.fillStyle = '#55FF55';
        }
        ctx.arc(molecule.x, molecule.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Filter out reacted molecules
      setMolecules(updatedMolecules.filter(m => !m.reacted || m.type === 'product'));
      setProductCount(newProductCount);
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    animationFrameId = window.requestAnimationFrame(render);
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, molecules, temperature, reactionRate, productCount]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative bg-card border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full"
        />
        
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-md p-2">
          <div className="text-xs font-medium">Products: {productCount}</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Temperature: {temperature}°C
            </label>
          </div>
          <Slider 
            value={[temperature]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(value) => setTemperature(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Reaction Rate
            </label>
          </div>
          <Slider 
            value={[reactionRate * 100]} 
            min={1} 
            max={20} 
            step={1}
            onValueChange={(value) => setReactionRate(value[0] / 100)}
          />
        </div>
        
        <div className="flex justify-between gap-2">
          <Button
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <><Pause className="mr-1 h-4 w-4" /> Pause</>
            ) : (
              <><Play className="mr-1 h-4 w-4" /> Start</>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetSimulation}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
