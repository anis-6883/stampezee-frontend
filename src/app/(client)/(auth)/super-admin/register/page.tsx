import { metaObject } from '@/config/site.config';
import Register from './components/Register';

export const metadata = {
  ...metaObject('Register Page'),
};

export default async function Page() {
  return <Register />;
}
