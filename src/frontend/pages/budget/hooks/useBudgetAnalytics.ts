import { useState } from 'react';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/hooks/useRepositoryData';

export function useBudgetAnalytics() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'VND'>('USD');
  const { data: dashboard, error } = useRepositoryData(dashboardRepository.getBudget);
  return { dashboard, error, drawerOpen, setDrawerOpen, currency, setCurrency };
}
