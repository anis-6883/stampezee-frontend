'use client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function IntroVideoSection({
  imagePosition = 'left',
  title,
  description,
  bg = false,
  bgImage,
  bgClass,
  bgHeight,
}: {
  imagePosition?: string;
  bg?: boolean;
  bgImage?: string;
  bgClass?: string;
  title: string;
  description: string;
  bgHeight?: string;
}) {
  useEffect(() => {
    AOS.init({
      easing: 'ease-out-quad',
      duration: 1000,
    });
  }, []);
  return (
    <div className={`container relative mx-auto ${bgHeight} mt-12 flex  items-center justify-between`}>
      {/* Background Image */}
      {/* image path  required for = your image path */}
      {bg && (
        <div
          className="absolute inset-0 z-0   bg-cover bg-center "
          style={{
            backgroundImage: `url(${bgImage})`,
            // You can adjust other background properties here like backgroundSize, backgroundPosition, etc.
          }}
        >
          {/* Overlay */}
          {/* class name  required for = bg-black opacity-5 */}
          <div className={`absolute inset-0 z-10 ${bgClass}`}></div>
        </div>
      )}
      {/* Content */}
      <div
        className={`${bg && 'absolute'} inset-0 z-0 mx-auto block  max-w-screen-xl items-center justify-between gap-5 text-black md:flex ${imagePosition == 'left' ? '' : 'flex-row-reverse'}`}
      >
        <div
          data-aos="fade-right"
          className="mb-8 flex w-full items-center justify-center overflow-hidden md:mb-0 md:w-1/2 lg:mb-16 sxl:mb-20"
        >
          <iframe
            className="h-[350px] w-[550px] rounded-xl shadow-lg"
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
    </div>
  );
}
