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
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
    const [open, setOpen] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [editedData, setEditedData] = useState(null); // State to hold the currently edited row's data
    const [formData, setFormData] = useState({
        column1: '',
        column2: '',
        column3: '',
        column4: '',
        pdfFile: null, // State to hold the uploaded PDF file
    });

    const sampleData = [
        { id: 1, column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', column4: 'Data 4', pdfLink: 'https://example.com/pdf1', pdfUrl: 'https://example.com/pdf/sample1.pdf', timeUploaded: '2024-04-12T10:30:00', priority: true },
        { id: 2, column1: 'Data 5', column2: 'Data 6', column3: 'Data 7', column4: 'Data 8', pdfLink: 'https://example.com/pdf2', pdfUrl: 'https://example.com/pdf/sample2.pdf', timeUploaded: '2024-04-12T11:30:00', priority: false },
        { id: 3, column1: 'Data 9', column2: 'Data 10', column3: 'Data 11', column4: 'Data 12', pdfLink: 'https://example.com/pdf3', pdfUrl: 'https://example.com/pdf/sample3.pdf', timeUploaded: '2024-04-12T12:30:00', priority: true },
        { id: 4, column1: 'Data 13', column2: 'Data 14', column3: 'Data 15', column4: 'Data 16', pdfLink: 'https://example.com/pdf4', pdfUrl: 'https://example.com/pdf/sample4.pdf', timeUploaded: '2024-04-12T13:30:00', priority: false },
        { id: 5, column1: 'Data 17', column2: 'Data 18', column3: 'Data 19', column4: 'Data 20', pdfLink: 'https://example.com/pdf5', pdfUrl: 'https://example.com/pdf/sample5.pdf', timeUploaded: '2024-04-12T14:30:00', priority: true },
    ];

    useEffect(() => {
        // Fetch data from the API
        // Replace the URL with your actual API endpoint
        fetch('https://api.example.com/data')
            .then((response) => response.json())
            .then((data) => {
                // Merge fetched data with sampleData if needed
                // setData(data)
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Sort sample data based on priority and then time uploaded
    const sortedSampleData = sampleData.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority ? -1 : 1; // Sort by priority
        } else {
            return new Date(a.timeUploaded) - new Date(b.timeUploaded); // If priority is the same, sort by time uploaded
        }
    });

    const handleOpen = (rowData) => {
        setEditedData(rowData); // Set the currently edited row's data
        setFormData(rowData); // Populate form data with row data
        setOpen(true); // Open the modal
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        if (e.target.name === 'pdfFile') {
            // Handle file upload
            setFormData({ ...formData, pdfFile: e.target.files[0] }); // Update pdfFile state with the selected file
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = () => {
        setOpen(false);
        const formDataToSend = new FormData();
        // Append form data to FormData object
        formDataToSend.append('column1', formData.column1);
        formDataToSend.append('column2', formData.column2);
        formDataToSend.append('column3', formData.column3);
        formDataToSend.append('column4', formData.column4);
        formDataToSend.append('pdfFile', formData.pdfFile); // Append the uploaded PDF file

        // Implement save functionality here
        // Assuming you have an API endpoint for updating form data
        // fetch('https://api.example.com/updateFormData', {
        //     method: 'PUT',
        //     body: formDataToSend,
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Form data updated successfully:', data);
        //     setOpen(false); // Close the modal after saving
        // })
        // .catch(error => {
        //     console.error('Error updating form data:', error);
        //     // Handle error
        // });

        console.log(formData);
    };

    return (
        <div>
            <h2>Notices</h2>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Section Dean Department</TableCell>
                            <TableCell align="right">Section Dean Department</TableCell>
                            <TableCell align="right">English Notice Subject</TableCell>
                            <TableCell align="right">Display End date</TableCell>
                            <TableCell align="right">Link attached</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedSampleData.map((row) => (
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
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleOpen(row)} // Pass the row data to handleEdit function
                                    >
                                        Edit
                                    </Button>
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
                        {/* Display form fields with data of the currently edited row */}
                        <TextField
                            label="Column 1"
                            name="column1"
                            value={formData.column1}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Column 2"
                            name="column2"
                            value={formData.column2}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Column 3"
                            name="column3"
                            value={formData.column3}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Column 4"
                            name="column4"
                            value={formData.column4}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleChange}
                            name="pdfFile"
                            style={{ marginBottom: '10px' }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default Component1;
