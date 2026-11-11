import React from 'react';
import Tooltip from '@mui/material/Tooltip';

export interface InfoTooltipProps {
  title: string;
  className?: string;
  ariaLabel?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  className = '',
  ariaLabel,
}) => {
  return (
    <Tooltip title={title} arrow placement="top">
      <span
        className={`budget-kpi-info cursor-help inline-flex items-center text-slate-400 hover:text-slate-600 transition-colors ${className}`}
        role="img"
        aria-label={ariaLabel || title}
        tabIndex={0}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-[15px] h-[15px]">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="8" cy="4.7" r=".75" fill="currentColor" />
        </svg>
      </span>
    </Tooltip>
  );
};

export default InfoTooltip;
