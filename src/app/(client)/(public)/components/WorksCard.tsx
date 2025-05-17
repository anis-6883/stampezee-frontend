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
        <div data-aos="fade-up-right" className="mb-2">
          <Image src={image} className="mx-auto size-28 md:size-32 lg:size-36" alt="image" />
        </div>
        <div className="mb-2 text-xl font-bold text-black md:text-2xl lg:text-3xl">{title}</div>
        <div className="mb-3 text-xl font-bold text-black md:mb-4 md:text-2xl lg:text-3xl xl:mb-6">{subTitle}</div>
        <p className="text-balance text-base text-black sm:text-xl">{description}</p>
        <p className="text-balance text-base text-black sm:text-xl">{subDescription}</p>
      </div>
    </div>
  );
}
