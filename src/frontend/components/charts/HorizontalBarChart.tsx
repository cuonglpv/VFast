const number = new Intl.NumberFormat('en-US');

export function HorizontalBarChart({ rows, max, formatValue = number.format, formatAxis = number.format }: {
  rows: { label: string; value: number }[];
  max: number;
  formatValue?: (value: number) => string;
  formatAxis?: (value: number) => string;
}) {
  const ceiling = Math.max(1, max, ...rows.map(row => row.value));
  return <div className="horizontal-bar-chart">
    <div className="horizontal-bar-rows">
      {rows.map((row, index) => <div className="horizontal-bar-row" key={row.label} tabIndex={0} aria-label={row.label + ': ' + formatValue(row.value)}>
        <span className="horizontal-bar-label">{row.label}</span>
        <div className="horizontal-bar-track"><span style={{ width: Math.max(0, row.value / ceiling * 100) + '%', background: index === 0 ? '#146db5' : '#0094d5' }} /></div>
        <span className="chart-tooltip bar-tooltip" aria-hidden="true"><strong>{row.label}</strong><span>{formatValue(row.value)}</span></span>
      </div>)}
    </div>
    <div className="horizontal-bar-axis">{[0, 1, 2, 3, 4].map(tick => <span key={tick} style={{ left: tick * 25 + '%' }}>{formatAxis(ceiling * tick / 4)}</span>)}</div>
  </div>;
}

