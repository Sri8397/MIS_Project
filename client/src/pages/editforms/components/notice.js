import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
    minWidth: '50%',
    minHeight: '50%',
  },
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const Component1 = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sampleData, setSampleData] = useState([
    { id: 1, column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', column4: 'Data 4', pdfLink: 'https://example.com/pdf1', pdfUrl: 'https://example.com/pdf/sample1.pdf' },
    { id: 2, column1: 'Data 5', column2: 'Data 6', column3: 'Data 7', column4: 'Data 8', pdfLink: 'https://example.com/pdf2', pdfUrl: 'https://example.com/pdf/sample2.pdf' },
    { id: 3, column1: 'Data 9', column2: 'Data 10', column3: 'Data 11', column4: 'Data 12', pdfLink: 'https://example.com/pdf3', pdfUrl: 'https://example.com/pdf/sample3.pdf' },
    { id: 4, column1: 'Data 13', column2: 'Data 14', column3: 'Data 15', column4: 'Data 16', pdfLink: 'https://example.com/pdf4', pdfUrl: 'https://example.com/pdf/sample4.pdf' },
    { id: 5, column1: 'Data 17', column2: 'Data 18', column3: 'Data 19', column4: 'Data 20', pdfLink: 'https://example.com/pdf5', pdfUrl: 'https://example.com/pdf/sample5.pdf' },
  ]);

  const handleOpen = (rowData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow(prevRow => ({
      ...prevRow,
      [name]: value,
    }));
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedRow(prevRow => ({
      ...prevRow,
      file: file,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setSampleData(prevData => {
      const newData = prevData.map(row => {
        if (row.id === selectedRow.id) {
          return selectedRow;
        }
        return row;
      });
      return newData;
    });
    handleClose();
  };

  return (
    <div>
      <h2>Component 1</h2>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Column 1</TableCell>
              <TableCell align="right">Column 2</TableCell>
              <TableCell align="right">Column 3</TableCell>
              <TableCell align="right">Column 4</TableCell>
              <TableCell align="right">Column 5 (Link)</TableCell>
              <TableCell align="right">Column 6 (PDF)</TableCell>
              <TableCell align="right">Edit</TableCell> {/* Add edit column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.column1}
                </TableCell>
                <TableCell align="right">{row.column2}</TableCell>
                <TableCell align="right">{row.column3}</TableCell>
                <TableCell align="right">{row.column4}</TableCell>
                <TableCell align="right">
                  <a href={row.pdfLink}>PDF Link</a>
                </TableCell>
                <TableCell align="right">
                  <button onClick={() => handleOpen(row)}>View PDF</button>
                </TableCell>
                <TableCell align="right">
                  <button onClick={() => handleOpen(row)}>Edit</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
              <TextField
                name="column1"
                label="Column 1"
                value={selectedRow?.column1 || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                name="column2"
                label="Column 2"
                value={selectedRow?.column2 || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                name="column3"
                label="Column 3"
                value={selectedRow?.column3 || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                name="column4"
                label="Column 4"
                value={selectedRow?.column4 || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
              />
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default Component1;
