import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import UploadArea from '../components/uploadArea';
import UploadArea from '../../forms/components/uploadArea';


import axios from "axios"
import { setDate } from 'date-fns';


const Component1 = () => {
    const classes = {}
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([])
    const [options, setOptions] = useState([]);
    const [elements, setElements] = useState([])
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [editedData, setEditedData] = useState(null); // State to hold the currently edited row's data
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({});

    const sampleData = [
        { id: 1, column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', column4: 'Data 4', pdfLink: 'https://example.com/pdf1', pdfUrl: 'https://example.com/pdf/sample1.pdf', timeUploaded: '2024-04-12T10:30:00', priority: true },
        { id: 2, column1: 'Data 5', column2: 'Data 6', column3: 'Data 7', column4: 'Data 8', pdfLink: 'https://example.com/pdf2', pdfUrl: 'https://example.com/pdf/sample2.pdf', timeUploaded: '2024-04-12T11:30:00', priority: false },
        { id: 3, column1: 'Data 9', column2: 'Data 10', column3: 'Data 11', column4: 'Data 12', pdfLink: 'https://example.com/pdf3', pdfUrl: 'https://example.com/pdf/sample3.pdf', timeUploaded: '2024-04-12T12:30:00', priority: true },
        { id: 4, column1: 'Data 13', column2: 'Data 14', column3: 'Data 15', column4: 'Data 16', pdfLink: 'https://example.com/pdf4', pdfUrl: 'https://example.com/pdf/sample4.pdf', timeUploaded: '2024-04-12T13:30:00', priority: false },
        { id: 5, column1: 'Data 17', column2: 'Data 18', column3: 'Data 19', column4: 'Data 20', pdfLink: 'https://example.com/pdf5', pdfUrl: 'https://example.com/pdf/sample5.pdf', timeUploaded: '2024-04-12T14:30:00', priority: true },
    ];
    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/department-sections');
            setElements(res.data.data);
            const response1 = await axios.get('http://localhost:8000/api/tenders    ');
            console.log(response1)
            setData(response1.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);

    // Sort sample data based on priority and then time uploaded
    const sortedModifiedData = data.sort((a, b) => {
        return new Date(a.timeUploaded) - new Date(b.timeUploaded); // If priority is the same, sort by time uploaded
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
        const { name, value, files } = e.target;
        if (name === 'pdfFile') {
            setFormData({ ...formData, [name]: files[0], attachmentType: 'pdf' });
        } else {
            setFormData({ ...formData, [name]: value });
        }

    };

    const handleSave = async () => {
        setOpen(false);
        console.log({ formData });
        const requestBody = new FormData();
        if (formData.attachmentType === 'link') {
            requestBody.append('attachment_link', formData.attachment_link);
        } else if (formData.attachmentType === 'pdf') {
            requestBody.append('attachment', files[0]);
        }
        requestBody.append('brief_description_en', formData.brief_description_en);
        requestBody.append('brief_description_hi', formData.brief_description_hi);
        requestBody.append('intender_email', formData.intender_email);
        requestBody.append('remarks', formData.remarks);
        requestBody.append('last_date_time', formData.last_date_time);
        requestBody.append('remarks', formData.remarks);
        requestBody.append('tender_number', formData.tender_number);
        
        console.log(requestBody.forEach((item) => console.log(item)));
        try {
            const res = await axios.post(`http://localhost:8000/api/tenders/${formData.id}`, requestBody, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); 
            fetchData();

        } catch (e) {
            console.log(e)
            // console.log("Something went wrong");
            // console.log(error.response.data.message);
            // Handle error
        }
        setErrorMessage('');

    };

    return (
        <div>
            <h2>Notices</h2>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tender Number</TableCell>
                            <TableCell align="right">Intender Email</TableCell>
                            <TableCell align="right">English Desc</TableCell>
                            <TableCell align="right">Hindi Desc</TableCell>
                            <TableCell align="right">Display End date</TableCell>
                            <TableCell align="right">Remarks</TableCell>
                            <TableCell align="right">Link attached</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedModifiedData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.tender_number}
                                </TableCell>
                                <TableCell align="right">{row.intender_email}</TableCell>
                                <TableCell align="right">{row.brief_description_en}</TableCell>
                                <TableCell align="right">{row.brief_description_hi}</TableCell>
                                <TableCell align="right">{row.last_date_time}</TableCell>
                                <TableCell align="right">{row.remarks}</TableCell>
                                <TableCell align="right">
                                    <a href={row.attachment_link}>Link</a>
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
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <div style={{ margin: "0 15vh", padding: "3vh", borderRadius: "5px", backgroundColor: "white", boxShadow: "inherit", outline: "none", minWidth: "50%", minHeight: "50%" }}>
                        <TextField
                            label="tender_number"
                            name="tender_number"
                            value={formData.tender_number || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="intender_email"
                            name="intender_email"
                            value={formData.intender_email || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="brief_description_en"
                            name="brief_description_en"
                            value={formData.brief_description_en || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="brief_description_hi"
                            name="brief_description_hi"
                            value={formData.brief_description_hi || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            type="datetime-local"
                            label="Display End date"
                            name="last_date_time"
                            value={formData.last_date_time || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Remarks"
                            name="remarks"
                            value={formData.remarks || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Attachment</InputLabel>
                            <Select
                                name="attachmentType"
                                value={formData.attachmentType || 'none'}
                                onChange={handleChange}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="link">Link</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                            </Select>
                        </FormControl>
                        {formData.attachmentType === 'link' && (
                            <TextField
                                label="Attachment_link"
                                name="attachment_link"
                                value={formData.attachment_link || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        )}
                        {formData.attachmentType === 'pdf' && (
                            <UploadArea files={files} setFiles={setFiles} setErrorMessage={setErrorMessage} />
                        )}
                        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                    </div>
                </Fade>
            </Modal>


        </div>
    );
};

export default Component1;
