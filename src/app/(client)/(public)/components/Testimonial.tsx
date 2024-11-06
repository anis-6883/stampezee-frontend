type TestimonialProps = {
  image: string;
  name: string;
  position: string;
  description: string;
};

export default function Testimonial({ image, name, position, description }: TestimonialProps) {
  return (
    <section className="my-4 flex justify-center">
      <div className="flex min-h-[497px] w-[380px] flex-col items-center justify-start rounded-3xl bg-[#FCE8E8] p-8 text-center shadow-lg dark:bg-violet-600 dark:text-gray-50">
        <img src={image} alt={`${name}'s profile`} className="mx-auto -mt-20 mb-6 h-24 w-24 rounded-full  object-cover shadow-lg" />
        <p className="mb-1 text-2xl font-bold sm:text-3xl">{name}</p>
        <p className="mb-4 text-sm font-bold text-gray-600 dark:text-gray-300 sm:text-base">{position}</p>
        <p className="mt-4 text-center text-xl font-[400] text-gray-700 dark:text-gray-100 sm:text-2xl">{description}</p>
      </div>
    </section>
  );
}
