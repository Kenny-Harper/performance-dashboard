// dataGenerator.ts — generates realistic simulated performance data
// in a real app this would come from an API or WebSocket connection
// TypeScript imports our interfaces so this file knows exactly what shape to return
import type { MetricReading, CoreStatus, DashboardMetrics } from './types';

// helper function that generates a random number between min and max
// the : number after each parameter is TypeScript — it means these must be numbers
// the : number after the ) is the return type — this function always returns a number
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// helper function that slightly changes a value to simulate realistic fluctuation
// clamp keeps the value between min and max so CPU doesn't go below 0 or above 100
function fluctuate(current: number, amount: number, min: number, max: number): number {
  const change = randomBetween(-amount, amount);
  return Math.min(max, Math.max(min, current + change));
}

// generates a single new metric reading with the current timestamp
// : MetricReading is the return type — TypeScript checks this matches the interface
function generateReading(value: number): MetricReading {
  return {
    timestamp: Date.now(),
    value: Math.round(value * 10) / 10, // round to 1 decimal place
  };
}

// tracks the current values so fluctuate can adjust them realistically
// without this every reading would be completely random with no continuity
let currentCpu = 45;
let currentMemory = 60;
let currentThroughput = 125;

// generates a full set of core statuses for all 4 IPU cores
// : CoreStatus[] means this function returns an array of CoreStatus objects
function generateCores(): CoreStatus[] {
  return [0, 1, 2, 3].map((id) => {
    const usage = Math.round(randomBetween(10, 95));

    // determine status based on usage level
    // this is a good example of TypeScript union types in action
    const status: 'active' | 'idle' | 'overloaded' =
      usage > 80 ? 'overloaded' : usage < 20 ? 'idle' : 'active';

    return {
      id,
      usage,
      status,
      temperature: Math.round(randomBetween(45, 85)),
    };
  });
}

// generates the initial full dataset when the dashboard first loads
// fills each metric array with 20 historical readings
// : DashboardMetrics is the return type — must match that interface exactly
export function generateInitialData(): DashboardMetrics {
  const readings = 20;

  return {
    cpu: Array.from({ length: readings }, () => {
      currentCpu = fluctuate(currentCpu, 5, 10, 95);
      return generateReading(currentCpu);
    }),
    memory: Array.from({ length: readings }, () => {
      currentMemory = fluctuate(currentMemory, 3, 20, 90);
      return generateReading(currentMemory);
    }),
    throughput: Array.from({ length: readings }, () => {
      currentThroughput = fluctuate(currentThroughput, 10, 80, 180);
      return generateReading(currentThroughput);
    }),
    cores: generateCores(),
  };
}

// generates one new tick of data — called every second to update the dashboard
// returns a partial update so we only change what needs changing
export function generateTick(): {
  cpu: MetricReading;
  memory: MetricReading;
  throughput: MetricReading;
  cores: CoreStatus[];
} {
  currentCpu = fluctuate(currentCpu, 5, 10, 95);
  currentMemory = fluctuate(currentMemory, 3, 20, 90);
  currentThroughput = fluctuate(currentThroughput, 10, 80, 180);

  return {
    cpu: generateReading(currentCpu),
    memory: generateReading(currentMemory),
    throughput: generateReading(currentThroughput),
    cores: generateCores(),
  };
}