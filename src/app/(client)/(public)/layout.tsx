import React from 'react';
import Footer from './components/web/Footer';
import HeaderContent from './components/web/HeaderContent';

export default function clientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <HeaderContent />
      {children}
      <Footer />
    </div>
  );
}
