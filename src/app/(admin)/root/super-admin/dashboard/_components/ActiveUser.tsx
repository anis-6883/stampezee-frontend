'use client';

import Button from '@/components/Formik/Button';
import Spinner from '@/components/ui/spinner';
import cn from '@/hooks/class-names';
import { useElementSize } from '@/hooks/use-element-size';
import { useEffect, useState, type ComponentProps } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import WorldMap, { CountryContext } from 'react-svg-worldmap';
import { useMedia } from 'react-use';
import { Badge, Text } from 'rizzui';
import UserStatsModal from './UserStatsModal';
import WidgetCard from './WidgetCard';

const bgColors = ['bg-[#148f77]', 'bg-[#f39c12]', 'bg-[#2e4053]', 'bg-[#a93226]', 'bg-[#b2babb]'];
const colors = ['#148f77', '#f39c12', '#2e4053', '#a93226', '#b2babb'];

function createTextLabels(width: number) {
  const labels: ({ label: string } & ComponentProps<'text'>)[] = [
    { label: 'Atlantic', x: 0.37 * width, y: 0.39 * width },
    { label: 'Indian', x: 0.69 * width, y: 0.57 * width },
    { label: 'Pacific', x: 0.083 * width, y: 0.48 * width },
    {
      label: 'Arctic',
      x: 0.75 * width,
      y: 0.058 * width,
    },
  ];
  if (width < 550) {
    return labels.map((label) => ({
      ...label,
      style: { ...label.style, fontSize: '70%' },
    }));
  }

  return labels;
}

export default function ActiveUsers({
  className,
  data,
  isLoading,
  title,
}: {
  className?: string;
  data: any;
  isLoading: boolean;
  title: string;
}) {
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [ref, { width }] = useElementSize();
  const is4k = useMedia('(min-width: 2000px)', false);
  const [modalState, setModalState] = useState(false);
  useEffect(() => {
    if (data?.length > 0) {
      const countryColorMap = data?.slice(0, 4)?.reduce((acc: any, country: any, index: number) => {
        if (country?.country) {
          acc[country?.country] = colors[index % colors.length]; // Assign color based on index
        }
        return acc;
      }, {});
      setColorMap(countryColorMap);
    }
  }, [data]);

  const getSCustomStyle = ({ countryValue, countryCode, minValue, maxValue, color }: CountryContext) => {
    return {
      fill: colorMap[countryCode?.toLocaleLowerCase()] ? colorMap[countryCode?.toLocaleLowerCase()] : color,
      fillOpacity: countryValue ? 0.1 + (1.5 * (countryValue - minValue)) / (maxValue - minValue) : 1,
      stroke: 'green',
      strokeWidth: 1,
      strokeOpacity: 0.2,
      cursor: 'pointer',
    };
  };

  const getHref = ({ countryName }: CountryContext) => ({
    href: `https://en.wikipedia.org/wiki/${encodeURIComponent(countryName || '')}`,
    target: '_blank',
  });

  return (
    <WidgetCard title={title} className={cn('relative grid grid-cols-1 place-content-between', className)} titleClassName="font-semibold">
      <div
        ref={ref}
        className="col-span-full flex flex-col [&>figure]:flex [&>figure]:items-center [&>figure]:justify-center [&_figure]:!bg-transparent [&_svg]:dark:invert"
      >
        {isLoading ? (
          <div className="m-auto">
            <Spinner size="lg" />
          </div>
        ) : data?.length === 0 ? (
          <div className="m-auto">
            <Text className="pb-6 text-center text-lg font-semibold">No data available!</Text>
          </div>
        ) : (
          <WorldMap
            color="white"
            valueSuffix="%"
            size="responsive"
            data={data}
            textLabelFunction={createTextLabels}
            styleFunction={getSCustomStyle}
            richInteraction
            hrefFunction={getHref}
          />
        )}
      </div>

      <div className="col-span-full -mx-5 flex flex-col gap-y-3 border-t border-dashed border-gray-200 px-5 pt-5 sm:flex-row sm:gap-y-0 lg:-mx-7 lg:px-7">
        <div className="mx-auto flex w-full flex-wrap justify-center gap-x-3 gap-y-1.5 text-center md:col-span-5">
          {data?.length > 0 &&
            !isLoading &&
            data?.slice(0, 4)?.map((country: any, index: number) => {
              return (
                <div key={country?.name ? country?.name : 1} className="flex items-center gap-1">
                  <Badge renderAsDot className={bgColors[index]} />
                  <Text className="text-gray-500 dark:text-gray-600">
                    {country?.name ? country?.name : 'N/A'}
                    <Text as="span" className="font-lexend ms-1 font-medium text-gray-700">
                      {`${country.value}%`}
                    </Text>
                  </Text>
                </div>
              );
            })}
        </div>
        {data?.length > 0 && (
          <div>
            <Button
              onClick={() => setModalState(true)}
              className="!m-0 w-full !px-2 !py-1.5 md:!w-32"
              text="See More"
              color="danger"
              preIcon={<FaInfoCircle className="text-base" />}
            />
          </div>
        )}
      </div>
      <UserStatsModal modalState={modalState} setModalState={setModalState} activeUsersStats={data} />
    </WidgetCard>
  );
}
