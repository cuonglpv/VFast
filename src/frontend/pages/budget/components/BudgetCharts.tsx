import { useId, useState } from "react";
import type { BudgetDashboardData } from "@/types/budget";
import { formatCurrency } from "@/utils";
import { SectionCard } from "@/components/cards/SectionCard";

export function CategoryBudgetAllocation({
  shares,
  total,
  margin: _margin,
}: {
  shares: BudgetDashboardData["categoryShares"];
  total: number;
  margin: number;
}) {
  return (
    <SectionCard className="budget-chart-card budget-allocation-card" title="Category Budget Allocation" tooltip="Monthly burn rate vs allocated ceiling" headerClassName="budget-chart-heading" titleClassName="inline-flex items-center gap-2" actions={<span className="budget-chart-total">{formatCurrency(total)} Total</span>}>
      <div className="budget-allocation-list">
        {shares.map((share) => {
          const percentage =
            share.allocated > 0
              ? Math.round((share.spent / share.allocated) * 100)
              : null;
          return (
            <div
              className="budget-category-row"
              key={share.category}
              tabIndex={0}
              aria-label={`${share.category}: ${formatCurrency(share.spent)} spent of ${formatCurrency(share.allocated)} allocated${percentage === null ? "" : `, ${percentage}%`}`}
            >
              <div className="budget-category-heading">
                <span>{share.category}</span>
              </div>
              <div className="budget-category-progress">
                <div className="budget-category-track">
                  <span
                    style={{
                      width: `${Math.max(0, Math.min(100, percentage ?? 0))}%`,
                      backgroundColor: share.color || "#0f67b1",
                    }}
                  />
                </div>
                <span className="budget-category-percentage">
                  {percentage === null ? "—" : `${percentage}%`}
                </span>
              </div>
              <div
                className="chart-tooltip budget-category-tooltip"
                aria-hidden="true"
              >
                <strong>{share.category}</strong>
                <span>Spent: {formatCurrency(share.spent)}</span>
                <span>Allocated: {formatCurrency(share.allocated)}</span>
              </div>
            </div>
          );
        })}
        {!shares.length && (
          <p className="budget-chart-empty">
            No category allocations available.
          </p>
        )}
      </div>
      {/* <div className="budget-allocation-footer">
        <div className="budget-allocation-status">
          <i />
          <span>Burn rate threshold: ±{margin}%</span>
        </div>
        <span>
          Target burn: <strong>Optimal</strong>
        </span>
      </div> */}
    </SectionCard>
  );
}

export function AnnualSpendingTrajectory({
  data,
  budgetCap,
}: {
  data: BudgetDashboardData["monthlySpend"];
  budgetCap: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = useId();
  const titleId = useId();
  const peak = Math.max(1, budgetCap, ...data.map((item) => item.actual));
  const roughStep = Math.max(1, (peak * 1.1) / 4);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step =
    [1, 2, 2.5, 5, 10]
      .map((value) => value * magnitude)
      .find((value) => value >= roughStep) ?? magnitude * 10;
  const ceiling = step * 4;
  const left = 64;
  const right = 776;
  const baseline = 222;
  const plotHeight = 180;
  const y = (value: number) => baseline - (value / ceiling) * plotHeight;
  const points = data.map((item, index) => ({
    ...item,
    x:
      data.length === 1
        ? (left + right) / 2
        : left + (index * (right - left)) / Math.max(1, data.length - 1),
    y: y(item.actual),
  }));
  const line = points
    .map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`)
    .join(" ");
  const area =
    points.length > 1
      ? `${line} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
      : "";
  const activePoint = activeIndex === null ? undefined : points[activeIndex];
  const axisMoney = (value: number) =>
    "$" +
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(
      value >= 1000 ? value / 1000 : value,
    ) +
    (value >= 1000 ? "k" : "");

  return (
    <SectionCard className="budget-chart-card budget-spending-card" title="Annual Spending Trajectory" tooltip="Cumulative spend compared with the budget cap" headerClassName="budget-chart-heading" titleClassName="inline-flex items-center gap-2">
      <ul className="budget-spending-legend" aria-label="Spending chart legend">
        <li>
          <i className="budget-legend-actual" />
          Actual
        </li>
        <li>
          <i className="budget-legend-cap" />
          Budget cap
        </li>
      </ul>
      {!data.length ? (
        <p className="budget-chart-empty">No spending data available.</p>
      ) : (
        <div className="budget-spending-scroll">
          <div className="budget-spending-visual">
            <svg
              className="budget-spending-svg"
              viewBox="0 0 800 260"
              aria-labelledby={titleId}
            >
              <title id={titleId}>
                Cumulative spending by month in USD, compared with a budget cap
                of {formatCurrency(budgetCap)}.
              </title>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f67b1" stopOpacity=".16" />
                  <stop offset="100%" stopColor="#0f67b1" stopOpacity=".01" />
                </linearGradient>
              </defs>
              <text x={left} y="18" className="budget-axis-unit">
                USD
              </text>
              {[0, 1, 2, 3, 4].map((tick) => (
                <g key={tick}>
                  <line
                    x1={left}
                    x2={right}
                    y1={y(tick * step)}
                    y2={y(tick * step)}
                    stroke="#e9eef5"
                    strokeDasharray={tick ? "3 5" : undefined}
                  />
                  <text x={left - 12} y={y(tick * step) + 4} textAnchor="end">
                    {axisMoney(tick * step)}
                  </text>
                </g>
              ))}
              <line
                className="budget-cap-line"
                x1={left}
                x2={right}
                y1={y(budgetCap)}
                y2={y(budgetCap)}
                stroke="#93a9c1"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
              <text
                x={right}
                y={y(budgetCap) - 9}
                textAnchor="end"
                className="budget-cap-label"
              >
                Budget cap · {axisMoney(budgetCap)}
              </text>
              <path d={area} fill={`url(#${gradientId})`} />
              <path
                className="budget-actual-line"
                d={line}
                fill="none"
                stroke="#0f67b1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {activePoint && (
                <line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1="35"
                  y2={baseline}
                  stroke="#a6b9ce"
                  strokeDasharray="3 4"
                />
              )}
              {points.map((point, index) => {
                const hitLeft =
                  index === 0 ? left - 10 : (points[index - 1].x + point.x) / 2;
                const hitRight =
                  index === points.length - 1
                    ? right + 10
                    : (points[index + 1].x + point.x) / 2;
                return (
                  <g
                    key={`${point.month}-${index}`}
                    className="budget-spend-month"
                    tabIndex={0}
                    aria-label={`${point.month}: ${formatCurrency(point.actual)} actual spend; budget cap ${formatCurrency(budgetCap)}`}
                    onPointerEnter={() => setActiveIndex(index)}
                    onPointerLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={activeIndex === index ? 5.5 : 3.5}
                      fill="#fff"
                      stroke="#0f67b1"
                      strokeWidth="2"
                    />
                    <text x={point.x} y="247" textAnchor="middle">
                      {point.month}
                    </text>
                    <rect
                      x={hitLeft}
                      y="30"
                      width={hitRight - hitLeft}
                      height={baseline - 20}
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>
            {activePoint && (
              <div
                className="chart-tooltip budget-spending-tooltip"
                role="status"
                style={{
                  left: `${Math.min(82, Math.max(18, activePoint.x / 8))}%`,
                }}
              >
                <strong>{activePoint.month}</strong>
                <span>
                  <i className="budget-tooltip-actual" />
                  Actual<b>{formatCurrency(activePoint.actual)}</b>
                </span>
                <span>
                  <i className="budget-tooltip-cap" />
                  Budget cap<b>{formatCurrency(budgetCap)}</b>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
