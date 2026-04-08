export interface MetricReading {
  timestamp: number;
  value: number;
}

export interface CoreStatus {
  id: number;
  usage: number;
  status: 'active' | 'idle' | 'overloaded';
  temperature: number;
}

export interface DashboardMetrics {
  cpu: MetricReading[];
  memory: MetricReading[];
  throughput: MetricReading[];
  cores: CoreStatus[];
}

export interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ChartsProps {
  cpu: MetricReading[];
  memory: MetricReading[];
  throughput: MetricReading[];
}

export interface CoreGridProps {
  cores: CoreStatus[];
}

export type TimeRange = 10 | 30 | 60;