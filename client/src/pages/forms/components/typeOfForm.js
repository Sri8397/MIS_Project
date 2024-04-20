import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Paper, Grid, Typography} from '@mui/material';



function TypeOfForm({ handleOptionSelect }) {

  const options = [
    { id: 1, title: 'OfficeOrders', description: 'Form for office orders', },
    { id: 2, title: 'Notices', description: 'Form for notices',  },
    { id: 3, title: 'Tenders', description: 'Form for tenders', },
  ];

  const [selectedOption, setSelectedOption] = React.useState(null);

  const handleClick = (option) => {
    setSelectedOption(option.title === selectedOption ? null : option.title);
    handleOptionSelect(option.title.toLocaleLowerCase());
  };

  return (
    <div>
     <Grid container spacing={3} style={{ justifyContent: 'center' }}>
  {options.map((option) => (
    <Grid item key={option.id} xs={12} sm={6} md={4} lg={3}>
      <Paper
        onClick={() => handleClick(option)}
        style={{ cursor: 'pointer', padding: '20px', textAlign: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
      >
        {option.icon}
        <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '5px' }}>
          {option.title}
        </Typography>
        <Typography variant="body2" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>{option.description}</Typography>
      </Paper>
    </Grid>
  ))}
</Grid>

    </div>
  );
}

export default TypeOfForm;
