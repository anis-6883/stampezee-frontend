'use client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Image from './Image';

export default function WorksCard({ image, title, description }: { image: string; title: string; description: string }) {
  useEffect(() => {
    AOS.init({
      easing: 'ease-out-quad',
      duration: 1000,
    });
  }, []);
  return (
    <div data-aos="fade-up" data-aos-anchor-placement="top-bottom" className="overflow-hidden">
      <div className="mb-10 p-4 text-center">
        <div data-aos="fade-up-right">
          <Image src={image} className="mx-auto h-[150px] w-[150px]" alt="image" />
        </div>
        <div className="text-primary-black mb-2 text-2xl font-bold">{title}</div>
        <p className="text-primary-black text-[1.2rem] font-[600] leading-8">{description}</p>
      </div>
    </div>
  );
}
