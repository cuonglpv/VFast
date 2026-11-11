import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

export const GeneralAnalyticsPage: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Executive Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Cross-departmental license utilization, cost optimization, and waste recovery metrics.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Comprehensive analytics overview with ApexCharts trend visualizations.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GeneralAnalyticsPage;
