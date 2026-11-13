import { Link, type LinkProps } from 'react-router-dom';

export function BackLink({ children, className = '', ...props }: LinkProps) {
  return <Link {...props} className={`detail-back-link ${className}`.trim()}>
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    {children}
  </Link>;
}
