import React, { useState } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';

function UploadArea({ formData, setFormData, uploadedFiles }) {
  const [files, setFiles] = useState(uploadedFiles);

  const onDrop = (acceptedFiles) => {
    const updatedFiles = [...files, ...acceptedFiles];
    setFiles(updatedFiles);
    // For simplicity, let's just store the file names in the formData
    setFormData((prevData) => ({
      ...prevData,
      attachmentFiles: updatedFiles.map(file => ({
        name: file.name,
        file: file, // Store the file object
      })),
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const clearFiles = () => {
    setFiles([]);
    setFormData((prevData) => ({
      ...prevData,
      attachmentFiles: [],
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ border: '1px dashed #ccc', padding: '20px', borderRadius: '5px', textAlign: 'center', cursor: 'pointer' }} {...getRootProps()}>
        <input {...getInputProps()} />
        <Typography>Drag and drop files here, or click to select files</Typography>
        <ul>
          {files.map(file => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Button variant="contained" color="secondary" onClick={clearFiles}>
          Clear
        </Button>
      </Grid>
    </Grid>
  );
}

export default UploadArea;
