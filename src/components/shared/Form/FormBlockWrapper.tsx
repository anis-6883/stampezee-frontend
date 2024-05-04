import { Text } from 'rizzui';

export default function FormBlockWrapper({
  title,
  description,
  children,
  className,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
}>) {
  return (
    <section className={className}>
      <header className="col-span-2 mb-2 @5xl:mb-0">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? <Text className="mt-1 text-sm text-gray-500">{description}</Text> : null}
      </header>
      <div className="col-span-4 space-y-2">{children}</div>
    </section>
  );
}
