import type { HTMLAttributes, ReactNode } from 'react';
import { InfoTooltip } from '@/components/InfoTooltip';

interface SectionCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  tooltip?: string;
  actions?: ReactNode;
  headerClassName?: string;
  titleClassName?: string;
}

export function SectionCard({ title, tooltip, actions, headerClassName = 'health-chart-heading', titleClassName, className = '', children, ...props }: SectionCardProps) {
  return <article {...props} className={`portal-card ${className}`.trim()}>
    <div className={headerClassName}>
      <h2 className={titleClassName}>{title}{tooltip && <InfoTooltip title={tooltip} />}</h2>
      {actions}
    </div>
    {children}
  </article>;
}
