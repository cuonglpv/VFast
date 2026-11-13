import { useId, useState } from 'react';
import type { AnalyticsDashboardData } from '@/types/analytics';

const number = new Intl.NumberFormat('en-US');

export function SubscriptionDynamicsChart({ data }: { data: AnalyticsDashboardData['subscriptionDynamics'] }) {
  const id = useId();
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const { months, seatStatuses, unassigned } = data;
  const legend = [...seatStatuses, unassigned];
  const stackedTotals = months.map((_, index) => seatStatuses.reduce((sum, item) => sum + (item.values[index] ?? 0), 0));
  const peak = Math.max(1, ...stackedTotals, ...unassigned.values);
  const tickStep = peak <= 120 ? 20 : Math.ceil(peak / 6 / 10) * 10;
  const ceiling = tickStep * 6;
  const baseline = 210;
  const plotHeight = 180;
  const groupWidth = 1060 / Math.max(1, months.length);

  return <div className="lifecycle-visual">
    <ul className="lifecycle-legend" aria-label="License seat status">{legend.map(item => <li key={item.name}><i style={{ background: item.color }} />{item.name}</li>)}</ul>
    <div className="lifecycle-scroll"><div className="lifecycle-plot">
      <svg className="lifecycle-chart" viewBox="0 0 1120 246" aria-labelledby={id}>
        {[0, 1, 2, 3, 4, 5, 6].map(tick => {
          const y = baseline - tick / 6 * plotHeight;
          return <g key={tick}><line x1="42" x2="1112" y1={y} y2={y} stroke="#e7edf5" /><text x="32" y={y + 4} textAnchor="end">{number.format(tick * tickStep)}</text></g>;
        })}
        {months.map((month, index) => {
          const x = 56 + index * groupWidth + groupWidth * .18;
          let stacked = 0;
          return <g key={month} className="subscription-month" tabIndex={0} aria-label={month + ': ' + legend.map(item => item.name + ' ' + number.format(item.values[index] ?? 0)).join(', ')} onPointerEnter={() => setActiveMonth(index)} onPointerLeave={() => setActiveMonth(null)} onFocus={() => setActiveMonth(index)} onBlur={() => setActiveMonth(null)}>
            {activeMonth === index && <rect x={x - 9} y="22" width="63" height="190" fill="#edf5ff" rx="4" />}
            {seatStatuses.map(item => {
              const value = item.values[index] ?? 0;
              stacked += value;
              return value > 0 && <rect key={item.name} x={x} y={baseline - stacked / ceiling * plotHeight} width="18" height={value / ceiling * plotHeight} fill={item.color} />;
            })}
            {(unassigned.values[index] ?? 0) > 0 && <rect x={x + 27} y={baseline - unassigned.values[index] / ceiling * plotHeight} width="18" height={unassigned.values[index] / ceiling * plotHeight} fill={unassigned.color} />}
            <text x={x + 22} y="234" textAnchor="middle">{month}</text>
            <rect x={x - 9} y="22" width="63" height="216" fill="transparent" />
          </g>;
        })}
      </svg>
      {activeMonth !== null && <div className="chart-tooltip lifecycle-tooltip" role="status" style={{ left: Math.min(86, Math.max(14, (78 + activeMonth * groupWidth) / 1120 * 100)) + '%' }}><strong>{months[activeMonth]}</strong>{legend.map(item => <span key={item.name}><i style={{ background: item.color }} />{item.name}<b>{number.format(item.values[activeMonth] ?? 0)}</b></span>)}</div>}
    </div></div>
  </div>;
}
