// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// interface DragAndDropUploadProps {
//   setFieldValue: (field: string, value: any) => void;
//   name: string;
// }

// const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({ setFieldValue, name }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const selectedFile = acceptedFiles[0];
//       const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];

//       if (!validFormats.includes(selectedFile.type)) {
//         setError('Unsupported file format. Please upload a jpg, jpeg, or png file.');
//         setFile(null);
//         setFieldValue(name, null);
//       } else {
//         setError(null);
//         setFile(selectedFile);
//         setFieldValue(name, selectedFile);
//       }
//     },
//     [setFieldValue, name]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/jpeg, image/png, image/jpg' });

//   return (
//     <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyles}>
//       <input {...getInputProps()} />
//       {isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop some files here, or click to select files</p>}
//       {error && <p style={errorStyles}>{error}</p>}
//       {file && (
//         <div style={previewStyles}>
//           <img src={URL.createObjectURL(file)} alt="Preview" style={imageStyles} />
//           <p>{file.name}</p>
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

// v2==================

// import React, { useCallback, useEffect, useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// interface DragAndDropUploadProps {
//   setFieldValue: (field: string, value: any) => void;
//   name: string;
//   image?: File | null; // Define the image prop
// }

// const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({ setFieldValue, name, image }) => {
//   const [file, setFile] = useState<File | null>(); // Initialize file state with the image prop
//   const [error, setError] = useState<string | null>(null);

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const selectedFile = acceptedFiles[0];
//       const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];

//       if (!validFormats.includes(selectedFile.type)) {
//         setError('Unsupported file format. Please upload a jpg, jpeg, or png file.');
//         setFile(null);
//         setFieldValue(name, null);
//       } else {
//         setError(null);
//         setFile(selectedFile);
//         setFieldValue(name, selectedFile);
//       }
//     },
//     [setFieldValue, name]
//   );

//   useEffect(() => {
//     // Update the file state if the image prop changes
//     if (image) {
//       setFile(image);
//     }
//   }, [image]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/jpeg, image/png, image/jpg' });

//   return (
//     <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyles}>
//       <input {...getInputProps()} />
//       {file?.name != null && isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop some files here, or click to select files</p>}
//       {error && <p style={errorStyles}>{error}</p>}
//       {file && (
//         <div style={previewStyles}>
//           <img src={URL.createObjectURL(file)} alt="Preview" style={imageStyles} />
//           <p>{file.name}</p>
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

// v3=======================

// import React, { useCallback, useState, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';

// interface DragAndDropUploadProps {
//   setFieldValue: (field: string, value: any) => void;
//   name: string;
//   image?: File | string | null; // Updated type definition
// }

// const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({ setFieldValue, name, image }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(typeof image === 'string' ? image : null);
//   const [error, setError] = useState<string | null>(null);

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

//   useEffect(() => {
//     if (typeof image === 'string') {
//       setPreview(image);
//       setFile(null);
//     } else if (image instanceof File) {
//       setFile(image);
//       setPreview(URL.createObjectURL(image));
//     }
//   }, [image]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/jpeg, image/png, image/jpg' });

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

// v4 =====================

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DragAndDropUploadProps {
  setFieldValue: (field: string, value: any) => void;
  name: string;
  image?: any;
}

const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({ setFieldValue, name, image }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof image === 'string' && image != null) {
      setPreview(image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!validFormats.includes(selectedFile.type)) {
        setError('Unsupported file format. Please upload a jpg, jpeg, or png file.');
        setFile(null);
        setPreview(null);
        setFieldValue(name, null);
      } else {
        setError(null);
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setFieldValue(name, selectedFile);
      }
    },
    [setFieldValue, name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/jpeg, image/png, image/jpg' as any });

  return (
    <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyles}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop some files here, or click to select files</p>}
      {error && <p style={errorStyles}>{error}</p>}
      {preview && (
        <div style={previewStyles}>
          <img src={preview} alt="Preview" style={imageStyles} />
          {file && <p>{file.name}</p>}
        </div>
      )}
    </div>
  );
};

const dropzoneStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  borderWidth: '2px',
  borderRadius: '2px',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  width: '100%',
  margin: '0 auto',
  minHeight: '300px',
};

const previewStyles: React.CSSProperties = {
  marginTop: '20px',
  textAlign: 'center',
};

const imageStyles: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '300px',
  margin: '0 auto',
};

const errorStyles: React.CSSProperties = {
  color: 'red',
  marginTop: '10px',
};

export default DragAndDropUpload;
