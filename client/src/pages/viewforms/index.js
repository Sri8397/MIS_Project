import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import Component1 from './components/noticeTable';
import Component2 from './components/officeOrderTable';
import Component3 from './components/TenderTable';

const Default = () => {
  return (
    <div style={{height:"94%", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <div>Please select One of the options</div>
    </div >
  )
}

const MyComponent = () => {

  const [selectedOption, setSelectedOption] = useState(null);

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
        return <Default />;
    }
  };

  return (
    <div style={{height: "100%"}}>
      <Grid container spacing={0} justify="center" style={{ display: "flex", justifyContent: 'center' }}>
        <Grid style={{ flex: "1", padding: "5px" }} item>
          <Button
            variant="contained"
            fullWidth
            color={selectedOption === 'option1' ? 'secondary' : 'primary'}
            onClick={() => handleClick('option1')}
            style={{ borderRadius: "5px" }}
          >
            Notices
          </Button>
        </Grid>
        <Grid style={{ flex: "1", padding: "5px" }} item>
          <Button
            fullWidth
            variant="contained"
            color={selectedOption === 'option2' ? 'secondary' : 'primary'}
            onClick={() => handleClick('option2')}
            style={{ borderRadius: "5px" }}
          >
            Office Orders
          </Button>
        </Grid>
        <Grid style={{ flex: "1", padding: "5px" }} item>
          <Button
            fullWidth
            variant="contained"
            color={selectedOption === 'option3' ? 'secondary' : 'primary'}
            onClick={() => handleClick('option3')}
            style={{ borderRadius: "5px" }}
          >
            Tenders
          </Button>
        </Grid>
      </Grid>
      {renderComponent()}
    </div>
  );
};

export default MyComponent;
