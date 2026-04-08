import type { CoreGridProps } from './types';

// CoreGrid — displays the status of each IPU core
function CoreGrid({ cores }: CoreGridProps) {

  // returns a colour based on core status
  function statusColor(status: string): string {
    if (status === 'overloaded') return '#ef4444';
    if (status === 'idle') return '#64748b';
    return '#22c55e';
  }

  return (
    <div className="core-grid-card">
      <h3>IPU Core Status</h3>
      <div className="core-grid">
        {cores.map((core) => (
          <div
            key={core.id}
            className="core-item"
            style={{ borderColor: statusColor(core.status) }}
          >
            <p className="core-label">Core {core.id}</p>
            <p className="core-usage" style={{ color: statusColor(core.status) }}>
              {core.usage}%
            </p>
            <p className="core-status">{core.status}</p>
            <p className="core-temp">🌡 {core.temperature}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoreGrid;