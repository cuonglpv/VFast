import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/hooks/useRepositoryData';

export function useGeneralAnalytics() {
  const { data, error } = useRepositoryData(dashboardRepository.getAnalytics);
  const { hash } = useLocation();
  const breakdowns = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (data && hash === '#analytics-breakdowns') breakdowns.current?.scrollIntoView({ block: 'start' });
  }, [data, hash]);
  return { data, error, breakdowns };
}
