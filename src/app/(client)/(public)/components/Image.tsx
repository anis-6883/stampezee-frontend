export default function Image({ src, className, alt }: { src: string; className?: string; alt?: string }) {
  return <img src={src} className={`${className} object-fill`} alt={alt ?? ''} />;
}
