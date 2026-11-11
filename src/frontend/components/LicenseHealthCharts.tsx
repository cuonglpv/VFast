import { useId } from 'react';


export function HorizontalBarChart({ rows, max, currency = false }: {
  rows: { label: string; value: number }[];
  max: number;
  currency?: boolean;
}) {
  const format = (value: number) => currency ? (value === 0 ? '$0' : '$' + value / 1000 + 'k') : String(value);
  return <div className="horizontal-bar-chart" role="img" aria-label={rows.map(row => row.label + ': ' + format(row.value)).join(', ')}>
    <div className="horizontal-bar-rows">
      {rows.map((row, index) => <div className="horizontal-bar-row" key={row.label}>
        <span className="horizontal-bar-label">{row.label}</span>
        <div className="horizontal-bar-track" title={row.label + ': ' + format(row.value)}>
          <span style={{ width: Math.min(100, row.value / max * 100) + '%', background: index === 0 ? '#146db5' : '#0094d5' }} />
        </div>
      </div>)}
    </div>
    <div className="horizontal-bar-axis">
      {[0, 1, 2, 3, 4].map(tick => <span key={tick} style={{ left: tick * 25 + '%' }}>{format(max * tick / 4)}</span>)}
    </div>
  </div>;
}

const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const seatStatuses = [
  { name: 'Active', color: '#8bbce9', values: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] },
  { name: 'Inactive', color: '#2e7ac7', values: [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65] },
  { name: 'No activity', color: '#d8b7ef', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0] },
  { name: 'Not monitored', color: '#9179bb', values: [40, 15, 15, 40, 22, 24, 26, 24, 40, 40, 0, 40] },
];
const unassigned = { name: 'Unassigned', color: '#f6e6a0', values: [90, 60, 0, 90, 72, 60, 90, 80, 54, 90, 80, 90] };

export function SubscriptionDynamicsChart() {
  const id = useId();
  const baseline = 174;
  const scale = 1.2;
  const legend = [...seatStatuses, unassigned];

  return <>
    <ul className="lifecycle-legend" aria-label="License seat status">
      {legend.map(item => <li key={item.name}><i style={{ background: item.color }} />{item.name}</li>)}
    </ul>
    <svg className="lifecycle-chart" viewBox="0 0 1120 200" role="img" aria-labelledby={id}>
      <title id={id}>{'Monthly license seats by status; unassigned seats shown alongside monitored usage. ' + months.map((month, index) => month + ': ' + legend.map(item => item.name + ' ' + item.values[index]).join(', ')).join('; ')}</title>
      {[0, 20, 40, 60, 80, 100, 120].map(value => {
        const y = baseline - value * scale;
        return <g key={value}>
          <line x1="36" x2="1118" y1={y} y2={y} stroke="#e7edf5" />
          <text x="26" y={y + 3} textAnchor="end">{value}</text>
        </g>;
      })}
      {months.map((month, index) => {
        const x = 54 + index * 89;
        let accumulated = 0;
        return <g key={month} className="subscription-month">
          {seatStatuses.map(item => {
            const value = item.values[index];
            accumulated += value;
            return value > 0 && <rect key={item.name} x={x} y={baseline - accumulated * scale} width="17" height={value * scale} fill={item.color}>
              <title>{month + ' - ' + item.name + ': ' + value}</title>
            </rect>;
          })}
          {unassigned.values[index] > 0 && <rect x={x + 26} y={baseline - unassigned.values[index] * scale} width="17" height={unassigned.values[index] * scale} fill={unassigned.color}>
            <title>{month + ' - Unassigned: ' + unassigned.values[index]}</title>
          </rect>}
          <text x={x + 17} y="192" textAnchor="middle">{month}</text>
        </g>;
      })}
    </svg>
  </>;
}
