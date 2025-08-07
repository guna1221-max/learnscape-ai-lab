import { useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, HardDrive, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlgorithmComplexityChart } from '@/components/charts/AlgorithmComplexityChart';
import { ALGORITHMS, getAlgorithmsByCategory } from '@/config/algorithms';
import { AlgorithmInfo } from '@/types/algorithm';

const AlgorithmLab = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [inputSize, setInputSize] = useState<number>(100);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentAlgorithm = selectedAlgorithm ? ALGORITHMS[selectedAlgorithm] : null;

  // Analyze complexity scenario based on algorithm and input characteristics
  const analyzeComplexityScenario = useCallback((algorithm: AlgorithmInfo, inputSize: number) => {
    const scenarios = {
      'bubbleSort': {
        best: { condition: 'sorted array', complexity: 'O(n)' },
        worst: { condition: 'reverse sorted array', complexity: 'O(n²)' },
        average: 'O(n²)'
      },
      'quickSort': {
        best: { condition: 'good pivot selection', complexity: 'O(n log n)' },
        worst: { condition: 'poor pivot selection', complexity: 'O(n²)' },
        average: 'O(n log n)'
      },
      'dijkstra': {
        best: { condition: 'sparse graph', complexity: 'O(V log V)' },
        worst: { condition: 'dense graph', complexity: 'O(V²)' },
        average: 'O((V + E) log V)'
      },
      'gaussianElimination': {
        best: { condition: 'well-conditioned matrix', complexity: 'O(n³)' },
        worst: { condition: 'ill-conditioned matrix', complexity: 'O(n³) with numerical instability' },
        average: 'O(n³)'
      }
    };

    const scenario = scenarios[selectedAlgorithm as keyof typeof scenarios];
    if (!scenario) {
      return {
        predicted: 'average',
        reason: 'Standard implementation with typical input characteristics',
        complexity: algorithm.timeComplexity
      };
    }

    // Simple heuristics for prediction
    if (inputSize <= 50) {
      return {
        predicted: 'best',
        reason: scenario.best.condition,
        complexity: scenario.best.complexity
      };
    } else if (inputSize >= 1000) {
      return {
        predicted: 'worst',
        reason: scenario.worst.condition,
        complexity: scenario.worst.complexity
      };
    } else {
      return {
        predicted: 'average',
        reason: 'Typical input characteristics',
        complexity: scenario.average
      };
    }
  }, [selectedAlgorithm]);

  const getFilteredAlgorithms = () => {
    if (selectedCategory === 'all') return ALGORITHMS;
    return getAlgorithmsByCategory(selectedCategory as AlgorithmInfo['category']);
  };

  const complexityAnalysis = currentAlgorithm ? analyzeComplexityScenario(currentAlgorithm, inputSize) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container flex-1 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Design & Analysis of Algorithms</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Algorithm Selection Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Algorithm Selection
                </CardTitle>
                <CardDescription>
                  Choose an algorithm to analyze its complexity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="sorting">Sorting</SelectItem>
                      <SelectItem value="numerical">Numerical</SelectItem>
                      <SelectItem value="graph">Graph</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Algorithm</label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(getFilteredAlgorithms()).map(([key, algorithm]: [string, AlgorithmInfo]) => (
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

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Input Size: {inputSize}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="5000"
                    step="10"
                    value={inputSize}
                    onChange={(e) => setInputSize(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>10</span>
                    <span>5000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complexity Analysis */}
            {currentAlgorithm && complexityAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Complexity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Time</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-primary">
                        {currentAlgorithm.timeComplexity}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">Space</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-secondary">
                        {currentAlgorithm.spaceComplexity}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        complexityAnalysis.predicted === 'worst' ? 'text-destructive' : 
                        complexityAnalysis.predicted === 'best' ? 'text-green-500' : 'text-yellow-500'
                      }`} />
                      <span className="font-medium">
                        Predicted: {complexityAnalysis.predicted.toUpperCase()} Case
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {complexityAnalysis.reason}
                    </p>
                    <Badge variant={
                      complexityAnalysis.predicted === 'worst' ? 'destructive' : 
                      complexityAnalysis.predicted === 'best' ? 'default' : 'secondary'
                    }>
                      {complexityAnalysis.complexity}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>{currentAlgorithm.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="complexity" className="space-y-6">
              <TabsList>
                <TabsTrigger value="complexity">Complexity Chart</TabsTrigger>
                <TabsTrigger value="comparison">Algorithm Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="complexity">
                <AlgorithmComplexityChart
                  title="Time & Space Complexity Analysis"
                  category={selectedCategory === 'all' ? undefined : selectedCategory as AlgorithmInfo['category']}
                  enablePerformanceTesting={true}
                />
              </TabsContent>

              <TabsContent value="comparison">
                <Card>
                  <CardHeader>
                    <CardTitle>Algorithm Comparison</CardTitle>
                    <CardDescription>
                      Compare multiple algorithms by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(getFilteredAlgorithms()).map(([key, algorithm]: [string, AlgorithmInfo]) => (
                        <div 
                          key={key}
                          className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                            selectedAlgorithm === key 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted hover:border-muted-foreground/50'
                          }`}
                          onClick={() => setSelectedAlgorithm(key)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{algorithm.name}</h3>
                            <Badge variant="outline">{algorithm.category}</Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Time:</span>
                              <span className="font-mono">{algorithm.timeComplexity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Space:</span>
                              <span className="font-mono">{algorithm.spaceComplexity}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {algorithm.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlgorithmLab;