import type { ReactNode } from 'react';

export function InlineAlert({ children, tone = 'success', className = '' }: { children: ReactNode; tone?: 'success' | 'error'; className?: string }) {
  return <p role={tone === 'error' ? 'alert' : 'status'} className={`${tone === 'error' ? 'text-red-600 mt-2 text-sm' : 'form-message'} ${className}`.trim()}>{children}</p>;
}
