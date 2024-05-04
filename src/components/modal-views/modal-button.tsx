'use client';

import { useModal } from '@/components/modal-views/use-modal';
import cn from '@/hooks/class-names';
import { PiPlusBold } from 'react-icons/pi';
import { type ButtonProps } from 'rizzui';

interface ModalButtonProps extends ButtonProps {
  label?: string;
  className?: string;
  customSize?: string;
  icon?: React.ReactNode;
  view: React.ReactNode;
}

export default function ModalButton({
  label = 'New',
  className,
  customSize = '500px',
  view,
  icon = <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />,
  ...rest
}: ModalButtonProps) {
  const { openModal } = useModal();
  return (
    <button
      className={cn('', className)}
      onClick={() =>
        openModal({
          view,
          customSize,
        })
      }
      {...rest}
    >
      {icon}
      {label && label}
    </button>
  );
}
