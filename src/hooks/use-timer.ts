import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer(initialTime: number = 10) {
  const [timer, setTimer] = useState<number>(initialTime);
  const id = useRef<number | null>(null);

  const clear = () => {
    if (id.current !== null) {
      window.clearInterval(id.current);
      id.current = null;
    }
  };

  const start = useCallback(() => {
    clear();
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
  }, []);

  const reset = useCallback(() => {
    clear();
    setTimer(initialTime);
    start();
  }, [initialTime, start]);

  useEffect(() => {
    if (timer === 0) {
      clear();
    }
  }, [timer]);

  return { timer, start, reset, clear };
}
