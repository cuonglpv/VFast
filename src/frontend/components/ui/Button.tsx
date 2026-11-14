import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'plain';
  icon?: ReactNode;
}

export function Button({ variant = 'secondary', icon, className = '', type = 'button', children, ...props }: ButtonProps) {
  const appearance = variant === 'plain' ? '' : `portal-button${variant === 'primary' ? ' primary-button' : ''}`;
  return <button {...props} type={type} className={`${appearance} ${className}`.trim()}>
    {icon}{children}
  </button>;
}

export function IconButton({ className = '', ...props }: Omit<ButtonProps, 'variant'> & { 'aria-label': string }) {
  return <Button {...props} variant="plain" className={`p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${className}`} />;
}
