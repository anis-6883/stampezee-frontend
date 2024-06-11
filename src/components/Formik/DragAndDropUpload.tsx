import cn from '@/hooks/class-names';
import { useFormikContext } from 'formik';
import Image from 'next/image';
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
}: {
  className: string;
  value: any;
  onChange: any;
  size: number;
  sizeText: string;
  isRounded?: boolean;
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState<string>('');
  const { errors } = useFormikContext<any>();

  useEffect(() => {
    if (typeof value.image === 'string' && value.image != null) {
      setPreview(value.image as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.image]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      // console.log(file, 'file uplode ');

      // Check if the file is present and is an image
      if (file && file.type.startsWith('image/')) {
        // Check if the file size is within limits (1 MB in this example)
        if (file.size <= size) {
          const fileWithPreview = Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
          setPreview(fileWithPreview.preview);
          onChange(fileWithPreview);
          setError(''); // Clear any previous errors
        } else {
          setError('File size exceeds 1MB. Please choose a smaller file.');
        }
      } else {
        setError('Invalid file type. Please choose a valid image file.');
      }
    },
    [onChange, size]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: size, // 1 MB
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uri to avoid memory leaks
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const removeFile = () => {
    setPreview(null);
    onChange(null);
    setError(''); // Clear any previous errors
  };

  return (
    <>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        {value && preview ? (
          <div className="relative flex items-center gap-3">
            <Image
              src={preview}
              alt="Uploaded Image"
              width={0}
              height={0}
              sizes="100vw"
              className={cn('z-30 h-[120px] w-[120px] rounded-md border border-gray-200 object-contain p-1', isRounded && 'rounded-full')}
            />
            {/* {value && value.name && <p className="mt-2 text-[14px] font-bold text-gray-800">{value.name}</p>} */}
            {!isRounded ? (
              <button type="button" className="rounded bg-red-500 p-1" onClick={removeFile}>
                <FaTrashAlt className="hover:fill-secondary-400 h-5 w-5 fill-white transition-colors" />
              </button>
            ) : (
              <FaTrashAlt
                onClick={removeFile}
                className="hover:fill-secondary-400 absolute right-2 top-0 z-50 h-4 w-4 transform cursor-pointer fill-red-500 transition-all duration-700 ease-in-out hover:scale-125"
              />
            )}
          </div>
        ) : (
          <div
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-2',
              errors.image && '!border-red-500 ring-0 ',
              isRounded && 'h-[120px] w-[120px] gap-0 rounded-full'
            )}
          >
            <input {...getInputProps()} />
            <MdCloudUpload className={cn('text-4xl text-primary', isRounded && 'text-4xl')} />
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <label htmlFor="file-upload" className="relative cursor-pointer">
                    {!isRounded ? (
                      <div>
                        <span>Drag and drop</span>
                        <span className="text-primary"> or browse</span>
                        <span> to upload!</span>
                      </div>
                    ) : (
                      <span className="-mt-2 p-1 text-xs">Upload Image</span>
                    )}
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                </h3>
                {!isRounded && <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to {sizeText}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

{
  /* <DragAndDropUpload
value={{ name: 'image', image: values.image }}
onChange={(image: any) => setFieldValue('image', image)}
className="mt-2"
size={1024 * 1000}
sizeText="1MB"
/> */
}
