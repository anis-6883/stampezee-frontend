// // v1 =====================

// import React, { useCallback, useEffect, useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// interface DragAndDropUploadProps {
//   setFieldValue: (field: string, value: any) => void;
//   name: string;
//   image?: any;
// }

// const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({ setFieldValue, name, image }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof image === 'string' && image != null) {
//       setPreview(image);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const selectedFile = acceptedFiles[0];
//       const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];

//       if (!validFormats.includes(selectedFile.type)) {
//         setError('Unsupported file format. Please upload a jpg, jpeg, or png file.');
//         setFile(null);
//         setPreview(null);
//         setFieldValue(name, null);
//       } else {
//         setError(null);
//         setFile(selectedFile);
//         setPreview(URL.createObjectURL(selectedFile));
//         setFieldValue(name, selectedFile);
//       }
//     },
//     [setFieldValue, name]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/jpeg, image/png, image/jpg' as any });

//   return (
//     <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyles}>
//       <input {...getInputProps()} />
//       {isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop some files here, or click to select files</p>}
//       {error && <p style={errorStyles}>{error}</p>}
//       {preview && (
//         <div style={previewStyles}>
//           <img src={preview} alt="Preview" style={imageStyles} />
//           {file && <p>{file.name}</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// const dropzoneStyles: React.CSSProperties = {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '20px',
//   borderWidth: '2px',
//   borderRadius: '2px',
//   borderColor: '#eeeeee',
//   borderStyle: 'dashed',
//   backgroundColor: '#fafafa',
//   color: '#bdbdbd',
//   outline: 'none',
//   transition: 'border .24s ease-in-out',
//   cursor: 'pointer',
//   width: '100%',
//   margin: '0 auto',
//   minHeight: '300px',
// };

// const previewStyles: React.CSSProperties = {
//   marginTop: '20px',
//   textAlign: 'center',
// };

// const imageStyles: React.CSSProperties = {
//   maxWidth: '100%',
//   maxHeight: '300px',
//   margin: '0 auto',
// };

// const errorStyles: React.CSSProperties = {
//   color: 'red',
//   marginTop: '10px',
// };

// export default DragAndDropUpload;

// v2==============

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
}: {
  className: string;
  value: any;
  onChange: any;
  size: number;
  sizeText: string;
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (typeof value.image === 'string' && value.image != null) {
      setPreview(value.image as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.image]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      console.log(file, 'file uplode ');

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
          <div className="flex items-center gap-3">
            <Image
              src={preview}
              alt="Uploaded Image"
              width={0}
              height={0}
              sizes="100vw"
              className="h-24 w-24 rounded-md border border-gray-200 object-contain p-1"
            />
            {value && value.name && <p className="mt-2 text-[14px] font-bold text-gray-800">{value.name}</p>}
            <button type="button" className="rounded bg-red-500 p-1" onClick={removeFile}>
              <FaTrashAlt className="hover:fill-secondary-400 h-5 w-5 fill-white transition-colors" />
            </button>
          </div>
        ) : (
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-2">
            <input {...getInputProps()} />
            <MdCloudUpload className="h-20 w-20 fill-gray-500" />

            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <label htmlFor="file-upload" className="relative cursor-pointer">
                    <span>Drag and drop</span>
                    <span className="text-primary"> or browse</span>
                    <span> to upload!</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                </h3>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to {sizeText}</p>
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
