
import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BHCurveSimulationProps {
  isRunning?: boolean;
}

export function BHCurveSimulation({ isRunning = false }: BHCurveSimulationProps) {
  const [currentIntensity, setCurrentIntensity] = useState<number>(40);
  const [ironCore, setIronCore] = useState<boolean>(true);
  const [data, setData] = useState<{h: number[], b: number[]}>({ h: [], b: [] });
  const animationRef = useRef<number | null>(null);
  
  // Generate B-H curve data
  useEffect(() => {
    if (isRunning) {
      generateBHCurveData();
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning, currentIntensity, ironCore]);

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

  const animate = () => {
    // This function would be used for dynamic animations if needed
    animationRef.current = requestAnimationFrame(animate);
  };

  const chartData = {
    labels: data.h,
    datasets: [
      {
        label: 'B-H Curve',
        data: data.b,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'H (A/m)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'B (T)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Magnetic B-H Curve',
      },
    },
  };

  return (
    <div className="p-4 space-y-6">
      <div className="h-[300px]">
        <Line options={chartOptions} data={chartData} />
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="current-intensity">Current Intensity</Label>
                  <span className="text-sm text-muted-foreground">{currentIntensity} A</span>
                </div>
                <Slider
                  id="current-intensity"
                  min={10}
                  max={100}
                  step={5}
                  value={[currentIntensity]}
                  onValueChange={(value) => setCurrentIntensity(value[0])}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="iron-core"
                  checked={ironCore}
                  onChange={(e) => setIronCore(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="iron-core">Iron Core (vs Air Core)</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
