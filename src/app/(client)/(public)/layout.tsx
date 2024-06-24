import React from 'react';
import Footer from './components/web/Footer';
import HeaderContent from './components/web/HeaderContent';

export default function clientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1300px]">
      <HeaderContent />
      {children}
      <Footer />
    </div>
  );
}
