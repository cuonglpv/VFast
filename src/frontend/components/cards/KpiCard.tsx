import type { ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Button } from '@/components/ui/Button';

export interface KpiCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  tooltipText?: string;
  valueTooltip?: string;
  chipLabel?: string;
  chipColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  actionLabel?: string;
  onActionClick?: () => void;
  variant?: 'health' | 'budget' | 'summary' | 'compact';
  status?: ReactNode;
  footer?: ReactNode;
  valueClassName?: string;
}

export function KpiCard({ title, value, subtitle, tooltipText, valueTooltip, chipLabel, chipColor = 'default', actionLabel, onActionClick, variant = 'health', status, footer, valueClassName }: KpiCardProps) {
  const tone = chipColor === 'error' ? 'negative' : chipColor === 'warning' ? 'warning' : chipColor === 'success' || chipColor === 'primary' ? 'positive' : 'neutral';
  const note = status ?? (chipLabel ? <span className={`metric-note ${tone}`}>{chipLabel}</span> : subtitle ? <span className="metric-note">{subtitle}</span> : null);
  const action = actionLabel && <Button variant="plain" className="budget-renewals-link" onClick={onActionClick}>{actionLabel}</Button>;
  const valueElement = <strong className={variant === 'budget' ? 'budget-kpi-value' : valueClassName}>{value}</strong>;

  if (variant === 'budget') return <article className="budget-kpi-card">
    <div className="budget-kpi-heading"><h2>{title}</h2>{tooltipText && <InfoTooltip title={tooltipText} />}</div>
    {valueTooltip ? <Tooltip title={valueTooltip} placement="top-start" arrow>{valueElement}</Tooltip> : valueElement}
    <div className="budget-kpi-footer"><div className="budget-kpi-state">{note}{action}</div>{footer}</div>
  </article>;

  return <article className={`portal-card${variant === 'health' ? ' health-metric' : variant === 'summary' ? ' summary-card' : ''}`}>
    {variant === 'compact' ? <span>{title}</span> : <h2>{title}{tooltipText && <InfoTooltip title={tooltipText} />}</h2>}
    {valueElement}
    {variant === 'compact' ? subtitle && <small>{subtitle}</small> : note}
    {action}{footer}
  </article>;
}

export default KpiCard;
