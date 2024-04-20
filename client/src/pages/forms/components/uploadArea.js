import React, { useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';

function UploadArea({ files, setFiles, setErrorMessage }) {
  const onDrop = (acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if(pdfFiles.length === 0) {
      setErrorMessage('Please upload only PDF files');
      return;
    }else{
      setFiles(pdfFiles);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ border: '1px dashed #ccc', padding: '20px', borderRadius: '5px', textAlign: 'center', cursor: 'pointer' }} {...getRootProps()}>
        <input {...getInputProps()} accept="application/pdf" />
        <Typography type="file">Drag and drop PDF files here, or click to select PDF files</Typography>
        <ul>
          {files.map(file => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={clearFiles}>
          Clear
        </Button>
      </Grid>
    </Grid>
  );
}

export default UploadArea;
