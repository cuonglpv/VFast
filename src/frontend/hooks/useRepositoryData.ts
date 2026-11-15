import { useEffect, useState } from 'react';

export function useRepositoryData<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setData(null);
    setError(false);
    load().then(result => { if (active) setData(result); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [load]);
  return { data, error };
}
