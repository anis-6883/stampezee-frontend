'use client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function IntroVideoSection({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    AOS.init({
      easing: 'ease-out-quad',
      duration: 1000,
    });
  }, []);
  return (
    <div className={`mx-auto mt-16 block  max-w-screen-xl flex-row-reverse items-center justify-between gap-5 text-black md:flex`}>
      <div data-aos="fade-right" className="mb-6 flex w-full items-center justify-center overflow-hidden md:mb-0 md:w-1/2 lg:mb-4 sxl:mb-8">
        <iframe
          className="h-[300px] w-[550px] rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div data-aos="fade-left" className=" overflow-hidden text-center md:w-1/2 md:text-left">
        <h1 className="mb-7 text-3xl font-bold text-black md:text-4xl lg:text-4xl  sxl:text-5xl">{title}</h1>
        <p className="text-balance text-base text-black md:text-lg sxl:text-xl">{description}</p>
      </div>
    </div>
  );
}
