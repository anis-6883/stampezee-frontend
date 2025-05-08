'use client';

import { Skeleton } from '@/components/ui/skeleton';
import cn from '@/hooks/class-names';
import Link from 'next/link';
import { FaRegEye } from 'react-icons/fa6';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Text, Tooltip } from 'rizzui';

const metricCardClasses = {
  base: 'border border-gray-200 bg-gray-0 p-5 dark:bg-gray-50 lg:p-6',
  rounded: {
    sm: 'rounded-sm',
    DEFAULT: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
  },
};

type MetricCardTypes = {
  title: string;
  metric: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  contentClassName?: string;
  chart?: React.ReactNode;
  info?: React.ReactNode;
  rounded?: keyof typeof metricCardClasses.rounded;
  titleClassName?: string;
  metricClassName?: string;
  chartClassName?: string;
  className?: string;
  isLoading?: boolean;
  isDetailsView?: boolean;
  detailsLink?: string;
  showInfo?: boolean;
  showInfoText?: string;
};

export default function MetricCard({
  title,
  metric,
  icon,
  chart,
  info,
  rounded = 'DEFAULT',
  className,
  iconClassName,
  contentClassName,
  titleClassName,
  metricClassName,
  chartClassName,
  children,
  isLoading = false,
  isDetailsView = false,
  detailsLink = '#',
  showInfo = false,
  showInfoText = '',
}: React.PropsWithChildren<MetricCardTypes>) {
  return (
    <div className="relative">
      <div className={cn(metricCardClasses.base, metricCardClasses.rounded[rounded], className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon ? (
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 lg:h-12 lg:w-12', iconClassName)}>
                {icon}
              </div>
            ) : null}

            <div className={cn(icon && 'ps-3', contentClassName)}>
              <Text className={cn('mb-0.5 flex items-center gap-x-1 text-gray-500', titleClassName)}>
                {title}

                {showInfo && (
                  <Tooltip
                    color="danger"
                    className={`bg-danger text-white`}
                    size="sm"
                    placement="top"
                    content={showInfoText}
                    arrowClassName={`fill-danger`}
                  >
                    <span>
                      <IoInformationCircleOutline className="text-lg text-danger " />
                    </span>
                  </Tooltip>
                )}
              </Text>
              <Text className={cn('font-lexend 2xl:xl:text-xl text-lg font-semibold text-gray-900 dark:text-gray-700', metricClassName)}>
                {isLoading ? <Skeleton className="h-5 w-28 rounded" /> : metric}
              </Text>

              {info ? info : null}
            </div>
          </div>

          {chart ? <div className={cn('h-12 w-20', chartClassName)}>{chart}</div> : null}
        </div>
        {children}
      </div>
      {isDetailsView && (
        <div className="absolute bottom-3 right-3">
          <Link href={detailsLink}>
            <FaRegEye className="text-lg text-gray-500 hover:text-black" />
          </Link>
        </div>
      )}
    </div>
  );
}
