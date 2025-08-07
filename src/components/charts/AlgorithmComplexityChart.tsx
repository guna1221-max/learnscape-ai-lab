import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Clock, HardDrive, Play, BarChart3 } from 'lucide-react';
import { AlgorithmInfo, ComplexityMeasurement } from '@/types/algorithm';
import { ALGORITHMS, getAlgorithmsByCategory } from '@/config/algorithms';

interface AlgorithmComplexityChartProps {
  title?: string;
  category?: AlgorithmInfo['category'];
  className?: string;
  onAlgorithmSelect?: (algorithm: AlgorithmInfo) => void;
  enablePerformanceTesting?: boolean;
}

const chartConfig = {
  time: {
    label: "Time Complexity",
    color: "hsl(var(--primary))",
  },
  space: {
    label: "Space Complexity", 
    color: "hsl(var(--secondary))",
  },
  actualTime: {
    label: "Actual Time",
    color: "hsl(var(--destructive))",
  },
  actualSpace: {
    label: "Actual Space",
    color: "hsl(var(--accent))",
  },
};

export const AlgorithmComplexityChart: React.FC<AlgorithmComplexityChartProps> = ({
  title = "Algorithm Complexity Analysis",
  category,
  className = "",
  onAlgorithmSelect,
  enablePerformanceTesting = false,
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [showActualComplexity, setShowActualComplexity] = useState(false);
  const [performanceMeasurements, setPerformanceMeasurements] = useState<ComplexityMeasurement[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Get algorithms based on category filter
  const availableAlgorithms = category 
    ? getAlgorithmsByCategory(category)
    : ALGORITHMS;

  const currentAlgorithm = selectedAlgorithm ? availableAlgorithms[selectedAlgorithm] : null;

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!currentAlgorithm) return [];

    const { inputSizes, timeCosts, spaceCosts } = currentAlgorithm.chartData;
    
    return inputSizes.map((size, index) => ({
      inputSize: size,
      time: timeCosts[index],
      space: spaceCosts[index],
      actualTime: performanceMeasurements[index]?.actualTime || 0,
      actualSpace: performanceMeasurements[index]?.actualSpace || 0,
    }));
  }, [currentAlgorithm, performanceMeasurements]);

  const handleAlgorithmChange = useCallback((algorithmKey: string) => {
    setSelectedAlgorithm(algorithmKey);
    setPerformanceMeasurements([]);
    const algorithm = availableAlgorithms[algorithmKey];
    if (algorithm && onAlgorithmSelect) {
      onAlgorithmSelect(algorithm);
    }
  }, [availableAlgorithms, onAlgorithmSelect]);

  // Mock performance testing function
  const runPerformanceTest = useCallback(async () => {
    if (!currentAlgorithm) return;
    
    setIsRunning(true);
    const measurements: ComplexityMeasurement[] = [];
    
    for (const inputSize of currentAlgorithm.chartData.inputSizes) {
      // Simulate performance measurement with random variations
      const baseTime = currentAlgorithm.chartData.timeCosts[currentAlgorithm.chartData.inputSizes.indexOf(inputSize)];
      const baseSpace = currentAlgorithm.chartData.spaceCosts[currentAlgorithm.chartData.inputSizes.indexOf(inputSize)];
      
      // Add realistic variance (±20%)
      const actualTime = baseTime * (0.8 + Math.random() * 0.4);
      const actualSpace = baseSpace * (0.9 + Math.random() * 0.2);
      
      measurements.push({
        inputSize,
        actualTime,
        actualSpace,
        theoreticalTime: baseTime,
        theoreticalSpace: baseSpace,
      });
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setPerformanceMeasurements(measurements);
    setIsRunning(false);
  }, [currentAlgorithm]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              Analyze time and space complexity of algorithms used in simulations
            </CardDescription>
          </div>
          {enablePerformanceTesting && currentAlgorithm && (
            <Button 
              onClick={runPerformanceTest}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Test Performance'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedAlgorithm} onValueChange={handleAlgorithmChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an algorithm to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(availableAlgorithms).map(([key, algorithm]: [string, AlgorithmInfo]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{algorithm.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {algorithm.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {enablePerformanceTesting && performanceMeasurements.length > 0 && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-actual"
                  checked={showActualComplexity}
                  onCheckedChange={setShowActualComplexity}
                />
                <label htmlFor="show-actual" className="text-sm font-medium">
                  Show Actual vs Theoretical
                </label>
              </div>
            )}
          </div>

          {/* Algorithm Info */}
          {currentAlgorithm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Time Complexity</p>
                  <p className="text-lg font-mono font-bold text-primary">
                    {currentAlgorithm.timeComplexity}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <HardDrive className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium">Space Complexity</p>
                  <p className="text-lg font-mono font-bold text-secondary">
                    {currentAlgorithm.spaceComplexity}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        {currentAlgorithm && chartData.length > 0 && (
          <div className="h-80">
            <ChartContainer config={chartConfig}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="inputSize" 
                  label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Operations/Memory Units', angle: -90, position: 'insideLeft' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="var(--color-time)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-time)", strokeWidth: 2, r: 4 }}
                  name="Time Complexity"
                />
                <Line
                  type="monotone"
                  dataKey="space"
                  stroke="var(--color-space)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-space)", strokeWidth: 2, r: 4 }}
                  name="Space Complexity"
                />
                
                {showActualComplexity && performanceMeasurements.length > 0 && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="actualTime"
                      stroke="var(--color-actualTime)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "var(--color-actualTime)", strokeWidth: 2, r: 3 }}
                      name="Actual Time"
                    />
                    <Line
                      type="monotone"
                      dataKey="actualSpace"
                      stroke="var(--color-actualSpace)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "var(--color-actualSpace)", strokeWidth: 2, r: 3 }}
                      name="Actual Space"
                    />
                  </>
                )}
              </LineChart>
            </ChartContainer>
          </div>
        )}

        {/* Algorithm Description */}
        {currentAlgorithm && (
          <div className="text-sm text-muted-foreground">
            <p>{currentAlgorithm.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};