import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RenewalObligation } from '@/types/budget';
import { formatCurrency, formatDate } from '@/utils';

interface BudgetRenewalsDrawerSectionProps {
  open: boolean;
  onClose: () => void;
  renewals: RenewalObligation[];
}

export const BudgetRenewalsDrawerSection: React.FC<BudgetRenewalsDrawerSectionProps> = ({
  open,
  onClose,
  renewals,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 640 },
          p: 3,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Upcoming Renewals
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Licenses and recurring subscriptions expiring next month
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {renewals.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              p: 2,
              mb: 1.5,
              border: '1px solid #E2E8F0',
              borderRadius: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.softwareName}
                  </Typography>
                  <Chip
                    label={item.status}
                    size="small"
                    color={item.status === 'Critical' ? 'error' : item.status === 'Warning' ? 'warning' : 'success'}
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              }
              secondary={
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  {item.publisher} • Renewal: {formatDate(item.renewalDate)} • Utilization: {item.activeUtilizationRate}%
                </Typography>
              }
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {formatCurrency(item.renewalCost)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default BudgetRenewalsDrawerSection;
