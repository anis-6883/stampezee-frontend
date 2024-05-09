import Image from './Image';

export default function Featured({
  imagePosition = 'left',
  image,
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
  image: string;
  title: string;
  description: string;
  bgHeight?: string;
}) {
  return (
    <div className={`container relative mx-auto ${bgHeight}`}>
      {/* Background Image */}
      {/* image path  required for = your image path */}
      {bg && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
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
        className={`${bg && 'absolute'} inset-0 z-20 mx-auto block  max-w-screen-xl items-center justify-between text-black md:flex ${imagePosition == 'left' ? '' : 'flex-row-reverse'}`}
      >
        <div className="mb-20 flex w-full items-center justify-center md:mb-0">
          <Image src={image} alt="image" />
        </div>
        <div className=" text-center md:text-left">
          <h1 className="mb-7 text-5xl font-bold text-primary-black">{title}</h1>
          <p className="text-xl font-bold text-primary-black">{description}</p>
        </div>
      </div>
    </div>
  );
}
