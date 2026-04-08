import type { ChartsProps } from './types';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

function Charts({ cpu, memory, throughput }: ChartsProps) {

  // format timestamp for X axis display
  function formatTime(timestamp: unknown): string {
    if (typeof timestamp !== 'number') return '';
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // format tooltip value
  function formatValue(value: unknown, unit: string): string {
    if (typeof value !== 'number') return '';
    return `${value} ${unit}`;
  }

  return (
    <div className="charts-grid">

      <div className="chart-card">
        <h3>CPU Usage <span className="chart-unit">%</span></h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={cpu}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
            <Tooltip
              labelFormatter={formatTime}
              formatter={(value: unknown) => [formatValue(value, '%'), 'CPU']}
              contentStyle={{ background: '#0d1221', border: '1px solid #1e2d4a' }}
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Memory Usage <span className="chart-unit">%</span></h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={memory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
            <Tooltip
              labelFormatter={formatTime}
              formatter={(value: unknown) => [formatValue(value, '%'), 'Memory']}
              contentStyle={{ background: '#0d1221', border: '1px solid #1e2d4a' }}
            />
            <Line type="monotone" dataKey="value" stroke="#a855f7" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Throughput <span className="chart-unit">TFLOPS</span></h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={throughput}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis domain={[80, 180]} stroke="#64748b" tick={{ fontSize: 10 }} />
            <Tooltip
              labelFormatter={formatTime}
              formatter={(value: unknown) => [formatValue(value, 'TFLOPS'), 'Throughput']}
              contentStyle={{ background: '#0d1221', border: '1px solid #1e2d4a' }}
            />
            <Line type="monotone" dataKey="value" stroke="#22c55e" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Charts;