import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { useEffect, useState } from 'react';

const useCurrencyExchange = ({ page, limit }: { page: number; limit: number }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
        const response = await axiosBackendUrl.get(`/api/web/currency-exchange/list?page=${page}&limit=${limit}`);
        setData(response?.data?.data?.docs);
        setLoading(true);
      } catch (err) {
        setError('Failed to fetch exchange rates.');
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);

  return { data, loading, error };
};

export default useCurrencyExchange;
