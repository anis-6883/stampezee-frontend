import { useEffect, useState } from 'react';

export default function useResponsiveFontSize(): string {
  const getFontSize = (): string => (window.innerWidth < 450 ? '16px' : '18px');

  const [fontSize, setFontSize] = useState<string>(getFontSize);

  useEffect(() => {
    const onResize = () => {
      setFontSize(getFontSize());
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []); // Added empty dependency array to ensure the effect runs only on mount/unmount

  return fontSize;
}
