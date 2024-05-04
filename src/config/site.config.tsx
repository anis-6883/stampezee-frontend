import { Metadata } from 'next';

enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export const siteConfig = {
  title: 'StampEzee',
  description: `StampEzee is a comprehensive stamp collection system designed to streamline the process of purchasing stamps by order`,
  mode: MODE.LIGHT,
};

export const metaObject = (title?: string, description: string = siteConfig.description): Metadata => {
  return {
    title: title ? `${title} - StampEzee` : siteConfig.title,
    description,
  };
};
