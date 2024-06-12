import 'cropperjs/dist/cropper.css';
import { useFormikContext } from 'formik';
import { useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import Dropzone from 'react-dropzone';
import toast from 'react-hot-toast';
import { IoCloseCircle } from 'react-icons/io5';

export default function CropImageUpload({
  name,
  height,
  textColor,
  setFieldValue,
  values,
}: {
  textColor?: string;
  name: string;
  height: number;
  setFieldValue: any;
  values: any;
}) {
  const maxSize = 10; //MB
  const [preview, setPreview] = useState<string | null>(values[name]);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(values[name]);
  const cropperRef = useRef<ReactCropperElement>(null);

  const debouncedHandleCrop = debounce(() => {
    const cropper = cropperRef.current?.cropper;

    if (cropper) {
      const croppedImage = cropper?.getCroppedCanvas()?.toDataURL();
      croppedImage && setFieldValue(name, croppedImage);
    }
  }, 1000);

  const handleDrop = (files: any) => {
    const file = files[0];

    if (file.size < MBToBytes(maxSize)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setPreview(reader.result as string); // Converted selected image to base64 string
        debouncedHandleCrop();
        setFieldValue(name, reader.result as string);
      };
    } else {
      toast.error(`File size exceeds ${maxSize}MB limit`);
    }
  };

  // useEffect(() => {
  //   setFieldValue(name, values[name]);
  //   return () => {
  //     setFieldValue(name, undefined);
  //   };
  // }, [values]);

  return (
    <div className="h-40 rounded-md border border-dashed border-gray-300 md:h-full">
      {!values.image && !preview && (
        <Dropzone onDrop={handleDrop} accept={{ 'image/*': [] }} multiple={false}>
          {({ getRootProps, getInputProps }) => {
            return (
              <div {...getRootProps()} className="flex h-full cursor-pointer items-center justify-center p-3">
                <input {...getInputProps()} />
                <Zone {...getInputProps} image={preview} textColor={textColor} />
              </div>
            );
          }}
        </Dropzone>
      )}

      {preview && (
        <div className="relative">
          <div
            className="absolute right-2 top-2.5 z-50 cursor-pointer"
            onClick={() => {
              setPreview(null);
              setUploadedPreview(null);
              setFieldValue(name, '');
            }}
          >
            <IoCloseCircle className="text-error text-2xl" />
          </div>
          <Cropper
            ref={cropperRef}
            src={preview}
            style={{ height: height, width: '100%' }}
            dragMode="none"
            cropmove={debouncedHandleCrop}
            autoCropArea={1}
            // aspectRatio={aspectRatio}
          />
        </div>
      )}

      {/* {uploadedPreview && (
        <div className='relative'>
          <div className='flex items-center justify-center'>
            <img src={uploadedPreview} className='w-80' alt='uploaded' />
            <button
              type='button'
              className='absolute right-2 top-2.5 z-50 cursor-pointer'
              onClick={() => {
                setUploadedPreview(null);
                setFieldValue(name, "");
              }}
            >
              <IoCloseCircle className='text-2xl text-error' />
            </button>
          </div>
        </div>
      )} */}

      {/* preview window */}
      {/* {preview && (
        <div className='relative'>
          <div
            className='absolute right-2 top-2.5 z-50 cursor-pointer'
            onClick={() => {
              setPreview(null);
              setFieldValue(name, "");
            }}
          >
            <IoCloseCircle className='text-2xl text-error' />
          </div>

          <Cropper
            ref={cropperRef}
            src={preview}
            style={{ height: height, width: "100%" }}
            dragMode='none'
            cropmove={debouncedHandleCrop}
            autoCropArea={1}
            // aspectRatio={aspectRatio}
          />
        </div>
      )}

      {uploadedPreview && (
        <div className='relative'>
          <div className='flex items-center justify-center'>
            <img src={uploadedPreview} className='w-80' alt='uploaded' />
            <button
              type='button'
              className='absolute right-2 top-2.5 z-50 cursor-pointer'
              onClick={() => {
                setUploadedPreview(null);
                setFieldValue(name, "");
              }}
            >
              <IoCloseCircle className='text-2xl text-error' />
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

type props = { textColor?: string; name?: string; image: string | null; setValue?: Function };

function Zone({ image, textColor }: props) {
  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <img src="/upload.png" height={40} width={40} alt="upload" />
        <h3 className="mt-2 text-center text-sm font-medium text-gray-900">
          <label htmlFor="file-upload" className={`relative cursor-pointer ${textColor || 'text-white'}`}>
            <span>Drag and drop or browse to upload file!</span>
          </label>
        </h3>
      </div>
    );
  }
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    clearTimeout(timeoutId!); // Use ! to assert that timeoutId is not null
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function getSizeInMB(base64String: string) {
  const base64Image = base64String.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''); // Remove data URL prefix
  const binaryString = atob(base64Image); // Convert base64 to binary data
  const bytes = binaryString.length; // Get the length of the binary data in bytes
  const megabytes = bytes / (1024 * 1024); // Convert bytes to megabytes (1 megabyte = 1024 * 1024 bytes)
  return megabytes;
}

const MBToBytes = (bytes: number) => {
  return bytes * 1000000;
};
