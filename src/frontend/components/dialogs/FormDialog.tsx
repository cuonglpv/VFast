import { useId, type FormEventHandler, type ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { InlineAlert } from '@/components/feedback/InlineAlert';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  actions: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  error?: string;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export function FormDialog({ open, onClose, title, children, actions, onSubmit, error, maxWidth = 'sm' }: FormDialogProps) {
  const titleId = useId();
  const content = <>
    <DialogTitle id={titleId}>{title}</DialogTitle>
    <DialogContent>{children}{error && <InlineAlert tone="error">{error}</InlineAlert>}</DialogContent>
    <DialogActions>{actions}</DialogActions>
  </>;
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} aria-labelledby={titleId}>
    {onSubmit ? <form onSubmit={onSubmit}>{content}</form> : content}
  </Dialog>;
}
