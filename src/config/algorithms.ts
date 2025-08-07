import { AlgorithmInfo } from '@/types/algorithm';

// Helper function to generate complexity data points
const generateComplexityData = (
  inputSizes: number[],
  timeComplexityFunc: (n: number) => number,
  spaceComplexityFunc: (n: number) => number
) => ({
  inputSizes,
  timeCosts: inputSizes.map(timeComplexityFunc),
  spaceCosts: inputSizes.map(spaceComplexityFunc),
});

const inputSizes = [10, 50, 100, 500, 1000, 2000, 5000];

export const ALGORITHMS: Record<string, AlgorithmInfo> = {
  bubbleSort: {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Simple comparison-based sorting algorithm',
    category: 'sorting',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n * n, // O(n²)
      (n) => 1 // O(1)
    ),
  },
  
  quickSort: {
    name: 'Quick Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: 'Efficient divide-and-conquer sorting algorithm',
    category: 'sorting',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n * Math.log2(n), // O(n log n)
      (n) => Math.log2(n) // O(log n)
    ),
  },

  eulerMethod: {
    name: 'Euler Method',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'First-order numerical method for solving ODEs',
    category: 'numerical',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n, // O(n)
      (n) => 1 // O(1)
    ),
  },

  rungeKutta: {
    name: 'Runge-Kutta 4th Order',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Fourth-order numerical method for solving ODEs',
    category: 'numerical',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n * 4, // O(n) but with factor 4 for 4 evaluations
      (n) => 1 // O(1)
    ),
  },

  dijkstra: {
    name: "Dijkstra's Algorithm",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Shortest path algorithm for weighted graphs',
    category: 'graph',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n * Math.log2(n) + n * n * Math.log2(n), // Simplified (V + E) log V
      (n) => n // O(V)
    ),
  },

  newtonRaphson: {
    name: 'Newton-Raphson Method',
    timeComplexity: 'O(k)',
    spaceComplexity: 'O(1)',
    description: 'Root-finding algorithm using derivatives',
    category: 'numerical',
    chartData: generateComplexityData(
      [5, 10, 15, 20, 25, 30, 35], // iterations instead of input size
      (k) => k, // O(k) iterations
      (k) => 1 // O(1)
    ),
  },

  fft: {
    name: 'Fast Fourier Transform',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Efficient algorithm for computing DFT',
    category: 'physics',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n * Math.log2(n), // O(n log n)
      (n) => n // O(n)
    ),
  },

  monteCarlo: {
    name: 'Monte Carlo Simulation',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Statistical sampling method for complex calculations',
    category: 'physics',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n, // O(n)
      (n) => n // O(n) for storing samples
    ),
  },

  gaussianElimination: {
    name: 'Gaussian Elimination',
    timeComplexity: 'O(n³)',
    spaceComplexity: 'O(n²)',
    description: 'Method for solving systems of linear equations',
    category: 'numerical',
    chartData: generateComplexityData(
      [10, 20, 50, 100, 200, 300, 500],
      (n) => n * n * n, // O(n³)
      (n) => n * n // O(n²)
    ),
  },

  molecularDynamics: {
    name: 'Molecular Dynamics (N-body)',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    description: 'Simulation of molecular interactions',
    category: 'chemistry',
    chartData: generateComplexityData(
      inputSizes,
      (n) => n * n, // O(n²) for pairwise interactions
      (n) => n // O(n) for particle storage
    ),
  },
};

export const getAlgorithmsByCategory = (category: AlgorithmInfo['category']) => {
  return Object.entries(ALGORITHMS)
    .filter(([_, algo]) => algo.category === category)
    .reduce((acc, [key, algo]) => ({ ...acc, [key]: algo }), {});
};

export const getAllAlgorithms = () => ALGORITHMS;