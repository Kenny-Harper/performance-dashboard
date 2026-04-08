// App.tsx — root component, holds all state and drives the live updates
// useReducer manages complex state, useEffect runs the live data interval
import { useReducer, useEffect } from 'react';

// import type is required in TypeScript when importing only types
// this tells TypeScript these are used for type checking only, not runtime
import type { DashboardMetrics, TimeRange } from './types';

// import our data generator functions
import { generateInitialData, generateTick } from './dataGenerator';

// import child components
import MetricCard from './MetricCard';
import Charts from './Charts';
import CoreGrid from './CoreGrid';

// MAX_READINGS controls how many data points show on the charts
// older readings get removed when we hit this limit
const MAX_READINGS = 60;

// define the shape of our full app state using a TypeScript interface
// this is defined inline here as it's only used in this file
interface AppState {
  metrics: DashboardMetrics;
  timeRange: TimeRange;
  isPaused: boolean;
}

// define all possible actions our reducer can handle
// this is a union type — action must be ONE of these three shapes
type AppAction =
  | { type: 'TICK'; payload: ReturnType<typeof generateTick> }
  | { type: 'SET_TIME_RANGE'; payload: TimeRange }
  | { type: 'TOGGLE_PAUSE' };

// initial state — generated once when the app first loads
const initialState: AppState = {
  metrics: generateInitialData(),
  timeRange: 30,
  isPaused: false,
};

// reducer function — handles all state updates
// AppState and AppAction are TypeScript types that tell the reducer
// exactly what shape state and action must be
function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case 'TICK':
      return {
        ...state,
        metrics: {
          // for each metric, add the new reading and remove oldest if over MAX_READINGS
          cpu: [...state.metrics.cpu, action.payload.cpu].slice(-MAX_READINGS),
          memory: [...state.metrics.memory, action.payload.memory].slice(-MAX_READINGS),
          throughput: [...state.metrics.throughput, action.payload.throughput].slice(-MAX_READINGS),
          cores: action.payload.cores,
        },
      };

    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload };

    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { metrics, timeRange, isPaused } = state;

  // EFFECT: sets up a 1 second interval to generate new data
  // when isPaused is true the interval is cleared and data stops updating
  useEffect(() => {
    if (isPaused) return;

    // setInterval runs a function repeatedly every X milliseconds
    // 1000ms = 1 second
    const interval = setInterval(() => {
      dispatch({ type: 'TICK', payload: generateTick() });
    }, 1000);

    // cleanup function — clears the interval when component unmounts
    // or when isPaused changes — prevents memory leaks
    return () => clearInterval(interval);
  }, [isPaused]);

  // DERIVED VALUE: filter readings based on selected time range
  // timeRange is in seconds, timestamps are in milliseconds so multiply by 1000
  const cutoff = Date.now() - timeRange * 1000;
  const filteredMetrics = {
    cpu: metrics.cpu.filter((r) => r.timestamp > cutoff),
    memory: metrics.memory.filter((r) => r.timestamp > cutoff),
    throughput: metrics.throughput.filter((r) => r.timestamp > cutoff),
  };

  // DERIVED VALUES: get the latest reading for each metric for the summary cards
  const latestCpu = metrics.cpu[metrics.cpu.length - 1]?.value ?? 0;
  const latestMemory = metrics.memory[metrics.memory.length - 1]?.value ?? 0;
  const latestThroughput = metrics.throughput[metrics.throughput.length - 1]?.value ?? 0;

  return (
    <div className="app">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>⚡ IPU Performance Dashboard</h1>
          <p className="subtitle">Graphcore Intelligence Processing Unit Monitor</p>
        </div>
        <div className="header-right">
          {/* time range filter buttons */}
          <div className="time-filters">
            {([10, 30, 60] as TimeRange[]).map((range) => (
              <button
                key={range}
                className={timeRange === range ? 'active' : ''}
                onClick={() => dispatch({ type: 'SET_TIME_RANGE', payload: range })}
              >
                {range}s
              </button>
            ))}
          </div>
          {/* pause/resume button */}
          <button
            className={`pause-btn ${isPaused ? 'paused' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
        </div>
      </header>

      {/* metric summary cards */}
      <div className="metrics-row">
        <MetricCard
          title="CPU Usage"
          value={latestCpu}
          unit="%"
          color="#3b82f6"
          trend={latestCpu > 75 ? 'up' : latestCpu < 40 ? 'down' : 'stable'}
        />
        <MetricCard
          title="Memory Usage"
          value={latestMemory}
          unit="%"
          color="#a855f7"
          trend={latestMemory > 75 ? 'up' : latestMemory < 40 ? 'down' : 'stable'}
        />
        <MetricCard
          title="Throughput"
          value={latestThroughput}
          unit="TFLOPS"
          color="#22c55e"
          trend={latestThroughput > 150 ? 'up' : latestThroughput < 100 ? 'down' : 'stable'}
        />
      </div>

      {/* live line charts for each metric */}
      <Charts
        cpu={filteredMetrics.cpu}
        memory={filteredMetrics.memory}
        throughput={filteredMetrics.throughput}
      />

      {/* IPU core status grid */}
      <CoreGrid cores={metrics.cores} />

    </div>
  );
}

export default App;