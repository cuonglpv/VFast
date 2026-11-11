import React from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LicenseItem } from '@/types/license';
import { formatCurrency, formatDate } from '@/utils';

interface LicenseListSectionProps {
  licenses: LicenseItem[];
}

export const LicenseListSection: React.FC<LicenseListSectionProps> = ({ licenses }) => {
  return (
    <Card sx={{ p: 2 }}>
      {/* Filter Toolbar */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search software, publisher, or ID..."
          sx={{ width: 320 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Structured Data Table */}
      <TableContainer>
        <Table size="medium">
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Software / Publisher</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Seats (Assigned / Total)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Utilization</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Annual Cost</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Renewal Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {licenses.map((lic) => (
              <TableRow key={lic.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.light',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {lic.publisherInitials}
                    </Avatar>
                    <Box>
                      <Box sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                        {lic.softwareName}
                      </Box>
                      <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {lic.publisher}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>{lic.category}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {lic.assignedSeats.toLocaleString()} / {lic.totalSeats.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: lic.utilizationRate < 70 ? 'warning.main' : 'text.primary' }}>
                  {lic.utilizationRate}%
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatCurrency(lic.annualCost)}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                  {formatDate(lic.renewalDate)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={lic.status}
                    size="small"
                    color={
                      lic.status === 'Active'
                        ? 'success'
                        : lic.status === 'At Risk'
                        ? 'warning'
                        : 'default'
                    }
                    sx={{ height: 22, fontSize: '0.75rem', fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default LicenseListSection;
