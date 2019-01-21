import 'abortcontroller-polyfill';
import { useState, useEffect } from 'react';

export type FetchProps = {
  url: string;
  headers?: any;
};

export default (props: FetchProps) => {
  const controller = new AbortController();
  const [
    data,
    setData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  useEffect(async () => {
    try {
      const response = await fetch(props.url, {
        ...props,
        signal: controller.signal,
      });
      setData(await response.json());
      setLoading(false);
    } catch (e) {
      setError(e);
    }
    return () => controller.abort();
  }, []);

  return { data, loading, error };
};
