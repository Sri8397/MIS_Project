import React, { useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import Page1 from './components/pageOne';
import Page2 from './components/pageTwo';

function FormPage() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    page1: { files: [] },
    page2: { type: '', email: '', phone: '' },
    page3: { address: '', city: '', zip: '' },
  });

  const handleChange = (e, page) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [page]: {
        ...prevData[page],
        [name]: value,
      },
    }));
  };

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return <Page1 formData={formData} setFormData={setFormData} />;
      case 2:
        return <Page2 formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <></>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      {renderPage()}
      <Grid container spacing={2} justify="flex-end">
        {page > 1 && (
          <Grid item>
            <Button variant="contained" color="primary" onClick={prevPage}>
              Previous
            </Button>
          </Grid>
        )}
        {page < 3 && (
          <Grid item>
            <Button variant="contained" color="primary" onClick={nextPage}>
              Next
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default FormPage;
