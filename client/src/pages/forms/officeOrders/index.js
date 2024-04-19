import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Modal,
  FormControlLabel,
} from '@material-ui/core';
import UploadArea from '../components/uploadArea';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(2),
  },
  form: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
    '& .MuiFormControl-root': {
      marginBottom: theme.spacing(2),
    },
    '& .MuiPaper-root': {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    '& .MuiButton-root': {
      marginRight: theme.spacing(2),
    },
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
  },
  errorText: {
    color: 'red',
    marginBottom: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const OfficeOrders = () => {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState([]);
  const [elements, setElements] = useState([]); // State for options based on category
  const [selectedOption, setSelectedOption] = useState('');

  // State for selected option ID
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    englishTitle: '',
    hindiTitle: '',
    lastDate: '',
    attachmentRequired: false,
    attachmentType: '',
    attachmentLink: '',
    attachmentFiles: [],
    remarks: ''
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try{
        const res = await axios.get('http://localhost:8000/api/department-sections');
        setElements(res.data.data);
      } catch(e){
        console.log(e)
      }
    }
    fetchTypes();
  }, [])

const handleCategoryChange = (event) => {
  const { value } = event.target;
  setCategory(value);
  setFormData((prevData) => ({
    ...prevData,
    type: value,
  }));
  const filteredOptions = elements
  .filter((item) => item.type === value) 
  .map((item) => item.name); 
  setOptions(filteredOptions);
};

const handleOptionChange = (event) => {
  setSelectedOption(event.target.value);
  setFormData((prevData) => ({
    ...prevData,
    name: event.target.value,
  }));
};

  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'attachmentRequired') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
        attachmentType: '',
        attachmentLink: '',
        attachmentFiles: [],
      }));
    } else if (name === 'attachmentFiles') {
      return;
    } else {
      // Reset attachmentFiles if attachmentType is changed to 'link'
      if (name === 'attachmentType' && value === 'link') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          attachmentFiles: [],
          attachmentLink: value === 'link' ? '' : prevData.attachmentLink,
        }));
      }
      // Reset attachmentLink if attachmentType is changed to 'upload'
      else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };


  const nextStep = () => {
    if (step === 1 && (category === '' || selectedOption === '')) {
      setErrorMessage('Please fill in all required fields.');
      console.log("error")
      return;
    }
    if (step === 2 && (!formData.englishTitle || !formData.hindiTitle)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (step === 3) {
      if (!formData.lastDate) {
      setErrorMessage('Please fill in all required fields.');
      return;
      }else{
        console.log(formData.lastDate)
        const selectedDate = new Date(formData.lastDate);
        if (selectedDate < new Date()) {
          setErrorMessage('Please select a future date.');
          return;
        }
      }
    }
    
    setErrorMessage(''); // Clear error message
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const submitForm = async () => {
    if(step === 4 && formData.attachmentRequired && !formData.attachmentType){
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (step === 4 && formData.attachmentType === 'link' && !formData.attachmentLink || formData.attachmentType === 'upload' && files.length === 0) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
  
    const requestBody = new FormData();
    if (formData.attachmentType === 'link') {
      requestBody.append('attachment_link', formData.attachmentLink);
    } else if (formData.attachmentType === 'upload') {
      requestBody.append('attachment', files[0]);
    }
    requestBody.append('title_en', formData.englishTitle);
    requestBody.append('title_hi', formData.hindiTitle);
    requestBody.append('last_date_time', formData.lastDate);
    requestBody.append('remarks', formData.remarks);
    requestBody.append('department_section_id', elements.find((item) => item.name === selectedOption).id);
    
    try {
      const res = await axios.post('http://localhost:8000/api/office-orders', requestBody,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOpenModal(true); // Open modal after successful submission
    } catch (error) {
      console.log("Something went wrong");
      console.log(error);
      // Handle error
    }
    setErrorMessage(''); 
};
const closeModal = () => {
  setOpenModal(false); // Close modal
};

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Office Orders Page
      </Typography>
      <form className={classes.form}>
        {errorMessage && (
          <Typography className={classes.errorText}>{errorMessage}</Typography>
        )}

        {step === 1 && (
          <div>
            <Typography variant="h6">Section/Department</Typography>
            <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="section">Section</MenuItem>
            <MenuItem value="department">Department</MenuItem>
          </Select>
        </FormControl>
           <FormControl fullWidth>
          <InputLabel id="option-label">Option</InputLabel>
          <Select
            labelId="option-label"
            id="option"
            value={selectedOption}
            label="Option"
            onChange={handleOptionChange}
            disabled={options.length === 0}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          </div>
        )}
        {step === 2 && (
          <div>
            <Typography variant="h6">Give a suitable Title</Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="English Title"
              name="englishTitle"
              value={formData.englishTitle}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Hindi Title"
              name="hindiTitle"
              value={formData.hindiTitle}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <Typography variant="h6">Last Date/Time</Typography>
            <TextField
              fullWidth
              type="datetime-local"
              variant="outlined"
              name="lastDate"
              value={formData.lastDate}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {step === 4 && (
          <div>
            <Typography variant="h6">Attachment and Remarks (if Any)</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={formData.attachmentRequired}
                  onChange={handleChange}
                  name="attachmentRequired"
                />
              }
              label="If Attachment required"
            />
            {formData.attachmentRequired && (
              <>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Attachment Type</InputLabel>
                  <Select
                    label="Attachment Type"
                    name="attachmentType"
                    value={formData.attachmentType}
                    onChange={handleChange}
                  >
                    <MenuItem value="upload">Upload</MenuItem>
                    <MenuItem value="link">Link</MenuItem>
                  </Select>
                </FormControl>
                {formData.attachmentType === 'upload' && (
                  <UploadArea files = {files} setFiles = {setFiles} setErrorMessage={setErrorMessage}/>
                )}
                {formData.attachmentType === 'link' && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Attachment Link"
                    name="attachmentLink"
                    value={formData.attachmentLink}
                    onChange={handleChange}
                    required
                  />
                )}
              </>
            )}
            <TextField
              fullWidth
              variant="outlined"
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
        )}
        <Modal
          className={classes.modal}
          open={openModal}
          onClose={closeModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              Order Submitted Successfully
            </Typography>
            <Button variant="contained" color="primary" onClick={closeModal}>
              Close
            </Button>
          </div>
        </Modal>
        {/* Buttons */}
        <div className={classes.buttonGroup}>
          {step > 1 && (
            <Button variant="contained" color="primary" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < 4 && (
            <Button variant="contained" color="primary" onClick={nextStep}>
              Next
            </Button>
          )}
          {step === 4 && (
            <Button variant="contained" color="primary" onClick={submitForm}>
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OfficeOrders;


