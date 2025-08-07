export interface AlgorithmInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  category: 'sorting' | 'numerical' | 'graph' | 'physics' | 'chemistry';
  chartData: {
    inputSizes: number[];
    timeCosts: number[];
    spaceCosts: number[];
  };
}

export interface ComplexityMeasurement {
  inputSize: number;
  actualTime: number;
  actualSpace: number;
  theoreticalTime: number;
  theoreticalSpace: number;
}