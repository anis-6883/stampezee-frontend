import cn from '@/hooks/class-names';
import { useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTrashAlt } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

export default function DragAndDropUpload({
  className,
  value,
  onChange,
  size,
  sizeText,
  isRounded = false,
  uploadText = 'Upload Image',
  brandText = '',
  dimension = '250X250',
}: {
  className: string;
  value: any;
  onChange: any;
  size: number;
  sizeText: string;
  isRounded?: boolean;
  uploadText?: string;
  brandText?: string;
  dimension?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const { errors } = useFormikContext<any>();

  useEffect(() => {
    if (typeof value?.image === 'string' && value.image != null) {
      setPreview(value.image as any);
    }
  }, [value?.image]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size <= size) {
          const img = new Image();
          img.onload = () => {
            if (
              img?.width === img?.height &&
              img.width >= Number(dimension?.split('X')[0]) &&
              img.height >= Number(dimension?.split('X')[1])
            ) {
              const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
              });
              setPreview(fileWithPreview.preview);
              onChange(fileWithPreview);
              setError('');
            } else {
              setError(`Min. ${dimension?.split('X')[0]} px with width & height must be same!`);
            }
          };
          img.onerror = () => {
            setError('Could not read image dimensions. Please choose a valid image file!');
          };
          img.src = URL.createObjectURL(file);
        } else {
          setError('File size exceeds 1MB. Please choose a smaller file!');
        }
      } else {
        setError('Invalid file type. Please choose a valid image file!');
      }
    },
    [onChange, size, dimension]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    // maxSize: size,
    onDrop,
  });

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const removeFile = () => {
    setPreview(null);
    onChange(null);
    setError('');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <div {...getRootProps({ className: className })}>
        <input {...getInputProps()} />
        {value && preview ? (
          <div className="relative flex items-center gap-3">
            <img
              src={preview}
              alt="Uploaded Image"
              sizes="100vw"
              className={cn('z-30 h-[120px] w-[120px] rounded-md border border-gray-200 object-cover p-2', isRounded && 'rounded-full')}
            />
            {!isRounded ? (
              <button type="button" className="rounded bg-red-500 p-1" onClick={removeFile}>
                <FaTrashAlt className="hover:fill-secondary-400 h-5 w-5 fill-white transition-colors" />
              </button>
            ) : (
              <FaTrashAlt
                onClick={removeFile}
                className="hover:fill-secondary-400 absolute right-3 top-0 z-50 h-4 w-4 transform cursor-pointer fill-red-500 transition-all duration-700 ease-in-out hover:scale-125"
              />
            )}
          </div>
        ) : (
          <div
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-2',
              errors.image && '!border-danger ring-0',
              isRounded && 'h-[120px] w-[120px] gap-0 rounded-full',
              isRounded && error && '!border-danger ring-0'
            )}
          >
            <div className={className}>
              <MdCloudUpload className={cn('text-4xl text-danger', isRounded && 'text-4xl')} />
            </div>

            <>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                <label htmlFor="file-upload" className="relative cursor-pointer">
                  {!isRounded ? (
                    <div>
                      <span>Drag and drop</span>
                      <span {...getRootProps({ className: className })} className="text-danger">
                        {' '}
                        or browse
                      </span>
                      <span> to upload!</span>
                    </div>
                  ) : (
                    <span className="-mt-2 p-1 text-xs">{uploadText}</span>
                  )}
                </label>
              </h3>
              {!isRounded && <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to {sizeText}</p>}
            </>
          </div>
        )}
        {brandText && <h2 className="py-3 text-center font-medium">{brandText}</h2>}
      </div>

      {error && <p className=" text-sm text-danger">{error}</p>}
    </div>
  );
}
