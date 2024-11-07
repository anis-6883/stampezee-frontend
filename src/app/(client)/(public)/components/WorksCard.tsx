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
        <div className="mb-2 text-xl font-bold text-black sm:text-3xl">{title}</div>
        <div className=" mb-6 text-xl font-bold text-black sm:text-3xl">{subTitle}</div>
        <p className="text-balance text-base text-black sm:text-xl">{description}</p>
        <p className="text-balance text-base text-black sm:text-xl">{subDescription}</p>
      </div>
    </div>
  );
}
