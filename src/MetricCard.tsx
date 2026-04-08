// import the type — using 'import type' because MetricCardProps is a TypeScript type
import type { MetricCardProps } from './types';

// MetricCard — displays a single metric summary
// the : React.FC<MetricCardProps> syntax types this as a React component
// that receives MetricCardProps as its props
function MetricCard({ title, value, unit, color, trend }: MetricCardProps) {

  // pick an arrow symbol based on which direction the metric is trending
  const trendSymbol = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●';
  const trendColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#64748b';

  return (
    <div className="metric-card" style={{ borderTopColor: color }}>

      {/* card title e.g. "CPU Usage" */}
      <p className="metric-title">{title}</p>

      {/* main value display */}
      <div className="metric-value-row">
        <span className="metric-value" style={{ color }}>
          {value}
        </span>
        <span className="metric-unit">{unit}</span>
      </div>

      {/* trend indicator */}
      <p className="metric-trend" style={{ color: trendColor }}>
        {trendSymbol} {trend}
      </p>

    </div>
  );
}

export default MetricCard;