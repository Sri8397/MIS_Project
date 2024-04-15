import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Description, Notifications, Assignment } from '@material-ui/icons'; // Import Material-UI icons

const useStyles = makeStyles((theme) => ({
  container: {
    height: '65vh', // Set container height to full viewport height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3),
    cursor: 'pointer',
    transition: 'transform 0.2s',
    borderRadius: theme.spacing(2),
    textAlign: 'center',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  selectedPaper: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      transform: 'scale(1)',
    },
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

function TypeOfForm({ handleOptionSelect }) {
  const classes = useStyles();

  const options = [
    { id: 1, title: 'officeOrders', description: 'Form for office orders', icon: <Assignment className={classes.icon} /> },
    { id: 2, title: 'notices', description: 'Form for notices', icon: <Notifications className={classes.icon} /> },
    { id: 3, title: 'tenders', description: 'Form for tenders', icon: <Description className={classes.icon} /> },
  ];

  const [selectedOption, setSelectedOption] = React.useState(null);

  const handleClick = (option) => {
    setSelectedOption(option.title === selectedOption ? null : option.title);
    handleOptionSelect(option.title);
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={3} style={{ justifyContent: 'center' }}>
        {options.map((option) => (
          <Grid item key={option.id} xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={3}
              className={`${classes.paper} ${
                option.title === selectedOption ? classes.selectedPaper : ''
              }`}
              onClick={() => handleClick(option)}
            >
              {option.icon}
              <Typography variant="h6" className={classes.title}>
                {option.title.toLocaleLowerCase()}
              </Typography>
              <Typography variant="body2">{option.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default TypeOfForm;
