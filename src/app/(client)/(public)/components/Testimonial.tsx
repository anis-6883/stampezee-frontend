export default function Testimonial({
  image,
  name,
  position,
  description,
}: {
  image: string;
  name: string;
  position: string;
  description: string;
}) {
  return (
    <section className="my-4 rounded-sm dark:bg-[#FCE8E8] dark:text-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-center lg:flex-row lg:flex-wrap lg:justify-evenly">
        <div className=" my-6 flex max-w-sm flex-col rounded-3xl shadow-lg">
          <div className="flex flex-col items-center justify-center rounded-3xl bg-[#FCE8E8] p-8 dark:bg-violet-600 dark:text-gray-50">
            <img src={image} alt="" className="-mt-16 mb-2 h-16 w-16 rounded-full bg-cover bg-center dark:bg-[#FCE8E8] " />
            <p className="text-[2rem] font-bold  leading-tight">{name}</p>
            <p className="text-[1rem] text-sm font-[400] leading-tight">{position}</p>
            <p className="mt-3 text-center text-[1.1rem] text-sm font-[400]">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
