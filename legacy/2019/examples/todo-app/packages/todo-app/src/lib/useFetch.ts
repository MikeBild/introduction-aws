import { useState, useEffect } from 'react';

export type FetchProps = {
  url: string;
  token?: string;
};

export default ({
  url,
  token = '',
}: FetchProps): {
  data: any;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
} => {
  const controller = new AbortController();
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(undefined);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      const authHeader = token
        ? { Authorization: `Bearer ${token}` }
        : undefined;
      const response = await fetch(url, {
        headers: {
          ...authHeader,
        },
        signal: controller.signal,
      });
      if (response.status >= 400) throw new Error(response.statusText);
      setData(await response.json());
      setIsLoading(false);
    } catch (e) {
      setError(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    return () => controller.abort();
  }, []);

  return { data, isLoading, error, refetch };
};
