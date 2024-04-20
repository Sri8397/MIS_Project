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
import UploadArea from '../../forms/components/uploadArea';


import axios from "axios"


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

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/department-sections');
                setElements(res.data.data);
                const response = await axios.get('http://localhost:8000/api/notices');
                const modifiedData = response.data.data.map(notice => {
                    const type = res.data.data.find((item) => item.id === notice.department_section_id).type;
                    const name = res.data.data.find((item) => item.id === notice.department_section_id).name;
                    return { ...notice, department_type: type, department_name: name, }
                });
                setData(modifiedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Sort sample data based on priority and then time uploaded
    const sortedModifiedData = data.sort((a, b) => {
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
        const { name, value, files } = e.target;
        if (name === 'pdfFile') {
            setFormData({ ...formData, [name]: files[0], attachmentType: 'pdf' });
        } else {
            setFormData({ ...formData, [name]: value });
        }


        if (name === "department_type") {
            const option = [];
            elements.map((item) => {
                if (item.type === value) option.push(item.name);
            })
            setOptions(option);
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
        requestBody.append('title_en', formData.title_en);
        requestBody.append('title_hi', formData.title_hi);
        requestBody.append('last_date_time', formData.last_date_time);
        requestBody.append('remarks', formData.remarks);
        requestBody.append('department_section_id', elements.find((item) => item.name === formData.department_name).id);
        requestBody.append('priority', formData.priority);
        console.log(requestBody.forEach((item) => console.log(item)));
        try {
            const res = await axios.post(`http://localhost:8000/api/notices/${formData.id}`, requestBody, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); 
            console.log("res", res);

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
                            <TableCell>Section/Dept</TableCell>
                            <TableCell align="right">Section/Dept Name</TableCell>
                            <TableCell align="right">English Notice Subject</TableCell>
                            <TableCell align="right">Hindi Notice Subject</TableCell>
                            <TableCell align="right">Display End date</TableCell>
                            <TableCell align="right">Remarks</TableCell>
                            <TableCell align="right">Link attached</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedModifiedData.map((row) => (
                            <TableRow key={row.department_section_id}>
                                <TableCell component="th" scope="row">
                                    {row.department_type}
                                </TableCell>
                                <TableCell align="right">{row.department_name}</TableCell>
                                <TableCell align="right">{row.title_en}</TableCell>
                                <TableCell align="right">{row.title_hi}</TableCell>
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Section/Department</InputLabel>
                            <Select
                                name="department_type"
                                value={formData.department_type || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="section">Section</MenuItem>
                                <MenuItem value="department">Department</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Section/Dean Name</InputLabel>
                            <Select
                                name="department_name"
                                value={formData.department_name}
                                onChange={handleChange}
                            >
                                {options.map((item, index) => (<MenuItem value={item}>{item}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="English Notice Subject"
                            name="title_en"
                            value={formData.title_en || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Hindi Notice Subject"
                            name="title_hi"
                            value={formData.title_hi || ''}
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
