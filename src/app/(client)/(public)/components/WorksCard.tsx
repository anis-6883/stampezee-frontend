import Image from './Image';

export default function WorksCard({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <div>
      <div className="mb-10 p-4 text-center">
        <Image src={image} className="mx-auto h-[150px] w-[150px]" alt="image" />
        <div className="mb-2 text-2xl font-bold text-primary-black">{title}</div>
        <p className="text-[1.2rem] font-[600] leading-8 text-primary-black">{description}</p>
      </div>
    </div>
  );
}
