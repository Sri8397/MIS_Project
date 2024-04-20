import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Component1 from './components/noticeTable';
import Component2 from './components/officeOrderTable';
import Component3 from './components/TenderTable';

const useStyles = makeStyles((theme) => ({
  grid: {
    // backgroundColor:"black"
  },
  griditem: {
    flex: "1"
  }
}));

const MyComponent = () => {
  const classes = useStyles();

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
        return null;
    }
  };

  return (
    <div>
      <Grid className={classes.grid} container spacing={0} justify="center">
        <Grid className={classes.griditem} item>
          <Button
            variant="contained"
            fullWidth
            color={selectedOption === 'option1' ? 'secondary' : 'primary'}
            onClick={() => handleClick('option1')}
          >
            Notices
          </Button>
        </Grid>
        <Grid className={classes.griditem} item>
          <Button
            fullWidth
            variant="contained"
            color={selectedOption === 'option2' ? 'secondary' : 'primary'}
            onClick={() => handleClick('option2')}
          >
            Office Orders
          </Button>
        </Grid>
        <Grid className={classes.griditem} item>
          <Button
            fullWidth
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

export default MyComponent;
