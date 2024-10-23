'use client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Image from './Image';

export default function WorksCard({
  image,
  title,
  subTitle,
  description,
  subDescription,
}: {
  image: string;
  title: string;
  subTitle: string;
  description: string;
  subDescription: string;
}) {
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
        <div className="text-primary-black mb-2 text-xl font-bold sm:text-3xl">{title}</div>
        <div className="text-primary-black mb-2 text-xl font-bold sm:text-3xl">{subTitle}</div>
        <p className="text-primary-black text-balance text-base font-bold sm:text-xl">{description}</p>
        <p className="text-primary-black text-balance text-base font-bold sm:text-xl">{subDescription}</p>
      </div>
    </div>
  );
}
