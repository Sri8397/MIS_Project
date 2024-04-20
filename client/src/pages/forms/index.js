import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import Component1 from './notices';
import Component2 from './officeorders';
import Component3 from './tenders';

const FormsPage = () => {
  const [selectedOption, setSelectedOption] = useState('option1');

  const handleClick = (option) => {
    setSelectedOption(option);
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case 'option1':
        return <Component1 />;
      case 'option2':
        return <Component2 />;
      case 'option3':
        return <Component3 />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <Button 
            variant="contained" 
            color={selectedOption === 'option1' ? 'secondary' : 'primary'} 
            onClick={() => handleClick('option1')}
          >
            Notices
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            color={selectedOption === 'option2' ? 'secondary' : 'primary'} 
            onClick={() => handleClick('option2')}
          >
            Office Orders
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            color={selectedOption === 'option3' ? 'secondary' : 'primary'} 
            onClick={() => handleClick('option3')}
          >
            Tenders
          </Button>
        </Grid>
      </Grid>
      {renderComponent()}
    </div>
  );
};

export default FormsPage;
