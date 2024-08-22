import axios from 'axios';
import { useEffect, useState } from 'react';

interface CurrencyData {
  base: string;
  date: string;
  rates: { [key: string]: number };
}

const useCurrency = () => {
  const [data, setData] = useState<CurrencyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch exchange rates.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useCurrency;
