import type { ReactNode } from 'react';
import { InfoTooltip } from '@/components/InfoTooltip';

interface PageHeaderProps {
  title: ReactNode;
  tooltip?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
}

export function PageHeader({ title, tooltip, description, actions, className = 'page-heading', contentClassName, titleClassName = 'inline-flex items-center gap-2' }: PageHeaderProps) {
  return <div className={className}>
    <div className={contentClassName}>
      <h1 className={titleClassName}><span>{title}</span>{tooltip && <InfoTooltip title={tooltip} />}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions}
  </div>;
}
