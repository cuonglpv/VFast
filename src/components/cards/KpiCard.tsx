import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton, Chip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  tooltipText?: string;
  chipLabel?: string;
  chipColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  actionLabel?: string;
  onActionClick?: () => void;
}

/**
 * Strict 4-Element Minimalist KPI Card (IA v5.3 Rules Contract)
 * Row 1: Header + Tooltip
 * Row 2: Hero Value
 * Row 3: Single Status Chip / Subtitle
 * Row 4: Optional Action Trigger Link
 */
export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  tooltipText,
  chipLabel,
  chipColor = 'default',
  actionLabel,
  onActionClick,
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Row 1: Header + Tooltip */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {title}
          </Typography>
          {tooltipText && (
            <Tooltip title={tooltipText} arrow placement="top">
              <IconButton size="small" sx={{ p: 0.25, color: 'text.secondary' }}>
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Row 2: Hero Value */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
          {value}
        </Typography>

        {/* Row 3: Single Status Chip or Selective Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 24, mb: actionLabel ? 1 : 0 }}>
          {chipLabel ? (
            <Chip
              label={chipLabel}
              size="small"
              color={chipColor}
              sx={{ height: 22, fontSize: '0.75rem', fontWeight: 500 }}
            />
          ) : subtitle ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        {/* Row 4: Optional Action Trigger */}
        {actionLabel && (
          <Box sx={{ mt: 'auto', pt: 0.5 }}>
            <Typography
              variant="caption"
              onClick={onActionClick}
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {actionLabel}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
