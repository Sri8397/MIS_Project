import React from 'react';
import { Grid, Typography, TextField, MenuItem } from '@material-ui/core';

function Page2({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      page2: {
        ...prevData.page2,
        [name]: value,
      },
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Page 2</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Select Type of Form"
          name="type"
          value={formData.page2.type}
          onChange={handleChange}
        >
          <MenuItem value="Type 1">Type 1</MenuItem>
          <MenuItem value="Type 2">Type 2</MenuItem>
          <MenuItem value="Type 3">Type 3</MenuItem>
        </TextField>
      </Grid>
      </Grid>
  );
}

export default Page2;
