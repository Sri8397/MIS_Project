import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';

function Page1({ formData, setFormData }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Populate files state with file names from formData if available
    if (formData.page1 && formData.page1.files) {
      const fileNames = formData.page1.files.map(file => ({ name: file }));
      setFiles(fileNames);
    }
  }, [formData.page1]);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    // For simplicity, let's just store the file names in the formData
    setFormData((prevData) => ({
      ...prevData,
      page1: { ...prevData.page1, files: acceptedFiles.map(file => file.name) },
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const clearFiles = () => {
    setFiles([]);
    setFormData((prevData) => ({
      ...prevData,
      page1: { ...prevData.page1, files: [] },
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Page 1</Typography>
      </Grid>
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

export default Page1;
