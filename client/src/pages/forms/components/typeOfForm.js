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
    <div style = {{position:'relative',top: '30%'}}>
     <Grid container spacing={3} style={{ justifyContent: 'center' }}>
      {options.map((option) => (
        <Grid item key={option.id} xs={10} sm={6} md={4} lg={3}>
          <Paper
            onClick={() => handleClick(option)}
            style={{
              cursor: 'pointer',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              minWidth: '250px',
              transition: 'transform 0.3s ease'
            }}
            className="hoverPaper"
          >
            {option.icon}
            <Typography variant="h5" style={{ marginTop: '20px', marginBottom: '10px' }}>
              {option.title}
            </Typography>
            <Typography variant="body1" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>{option.description}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    </div>
  );
}

export default TypeOfForm;
