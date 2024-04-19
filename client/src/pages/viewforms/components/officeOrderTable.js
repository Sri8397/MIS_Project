import React, { useState, useEffect } from 'react';
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
import axios from 'axios';


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
}));

const Component1 = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  // const sampleData = [
  //   { id: 1, column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', column4: 'Data 4', pdfLink: 'https://example.com/pdf1', pdfUrl: 'https://example.com/pdf/sample1.pdf' },
  //   { id: 2, column1: 'Data 5', column2: 'Data 6', column3: 'Data 7', column4: 'Data 8', pdfLink: 'https://example.com/pdf2', pdfUrl: 'https://example.com/pdf/sample2.pdf' },
  //   { id: 3, column1: 'Data 9', column2: 'Data 10', column3: 'Data 11', column4: 'Data 12', pdfLink: 'https://example.com/pdf3', pdfUrl: 'https://example.com/pdf/sample3.pdf' },
  //   { id: 4, column1: 'Data 13', column2: 'Data 14', column3: 'Data 15', column4: 'Data 16', pdfLink: 'https://example.com/pdf4', pdfUrl: 'https://example.com/pdf/sample4.pdf' },
  //   { id: 5, column1: 'Data 17', column2: 'Data 18', column3: 'Data 19', column4: 'Data 20', pdfLink: 'https://example.com/pdf5', pdfUrl: 'https://example.com/pdf/sample5.pdf' },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/office-orders');
        console.log({response})
        console.log(response.data);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // const sortedSampleData = sampleData.sort((a, b) => {
  //   if (a.priority !== b.priority) {
  //     return a.priority ? -1 : 1; // Sort by priority
  //   } else {
  //     return new Date(a.timeUploaded) - new Date(b.timeUploaded); // If priority is the same, sort by time uploaded
  //   }
  // });

  const handleOpen = (pdfUrl) => {
    setSelectedPDF(pdfUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h2>Office Orders</h2>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Section </TableCell>
              <TableCell align="right">Dean</TableCell>
              <TableCell align="right">Subject English</TableCell>
              <TableCell align="right">Subject Hindi</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Link</TableCell>
              <TableCell align="right">Pdf</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.department_section_id}</TableCell>
                <TableCell align="right">{row.title_en}</TableCell>
                <TableCell align="right">{row.title_hi}</TableCell>
                <TableCell align="right">{row.last_date_time}</TableCell>
                <TableCell align="right">
                  <a href={row.attachment_link}>PDF Link</a>
                </TableCell>
                {/* <TableCell align="right">
                  <button onClick={() => handleOpen(row.pdfUrl)}>View PDF</button>
                </TableCell> */}
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
            <iframe
              title="PDF Viewer"
              width="100%"
              height="100%"
              src={selectedPDF}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default Component1;
