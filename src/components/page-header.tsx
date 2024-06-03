import Breadcrumb from '@/components/ui/breadcrumb';
import cn from '@/hooks/class-names';
import { Title } from 'rizzui';

export type PageHeaderTypes = {
  title: string;
  className?: string;
  img?: string;
  isSuperAdmin?: boolean;
  breadcrumb: { name: string; href?: string }[];
};

export default function PageHeader({
  title,
  children,
  className,
  img,
  isSuperAdmin = false,
  breadcrumb,
}: React.PropsWithChildren<PageHeaderTypes>) {
  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7', className)}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <div className="flex items-center gap-5">
          {img && <img src={img} alt={title} className="h-24 w-28 rounded-md" />}

          <div>
            <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
              {title}
            </Title>

            <Breadcrumb separator="" separatorVariant="circle" className="flex-wrap">
              {breadcrumb.map((item) => (
                <Breadcrumb.Item key={item.name} {...(item?.href && { href: item?.href })}>
                  {item.name}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
