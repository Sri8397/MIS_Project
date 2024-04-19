import React, { useState } from 'react';
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

const TendersMain = () => {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tenderNumber: '',
    category: '',
    englishDesc: '',
    hindiDesc: '',
    lastDate: '',
    indenterMail: '',
    attachmentRequired: false,
    attachmentType: '',
    attachmentLink: '',
    attachmentFiles: [],
    remarks: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [openModal, setOpenModal] = useState(false);
  const [files, setFiles] = useState([]); // State for uploaded files
  const [availableCategories, setAvailableCategories] = useState([]); 
  
  // useEffect(() => {
  //     const fetchAvailableCategories = async () => {
  //       try{
  //         const categories = 
  //       }
  //     }
  //   ,[]})

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
      else if (name === 'attachmentType' && value === 'upload') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          attachmentLink: '',
          attachmentFiles: value === 'upload' ? [] : prevData.attachmentFiles,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.tenderNumber || !formData.category)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (step === 2 && (!formData.englishDesc || !formData.hindiDesc)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (step === 3 && (!formData.lastDate || !formData.indenterMail)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if(step === 3){
      const selectedDate = new Date(formData.lastDate);
      if (selectedDate < new Date()) {
        setErrorMessage('Please select a future date.');
        return;
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
    requestBody.append('tender_number', formData.tenderNumber);
    requestBody.append('category', formData.category);
    requestBody.append('brief_description_en', formData.englishDesc);
    requestBody.append('brief_description_hi', formData.hindiDesc);
    requestBody.append('last_date_time', formData.lastDate);
    requestBody.append('intender_email', formData.indenterMail);
    requestBody.append('remarks', formData.remarks);

    try{
      const res = axios.post('http://localhost:8000/api/tenders', requestBody, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        });
      
      setOpenModal(true);
    }catch(e){
      // const error = e.response.data.errors;
      // error.map((err) => {
      //   console.log(err)
      // })
      console.log(error.response.data.message);
      
    }
    // Implement form submission logic here
    setErrorMessage(''); // Clear error message
};

const closeModal = () => {
  setOpenModal(false); // Close modal
};
  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Tenders Page
      </Typography>
      <form className={classes.form}>
        {errorMessage && (
          <Typography className={classes.errorText}>{errorMessage}</Typography>
        )}
        {/* Form steps */}
        {step === 1 && (
          <div>
            <Typography variant="h6">Tender Number</Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Tender Number"
              name="tenderNumber"
              value={formData.tenderNumber}
              onChange={handleChange}
              required
              />
            <Typography variant="h6">Select Category</Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <MenuItem value="department1">Category 1</MenuItem>
                <MenuItem value="department2">Category 2</MenuItem>
                <MenuItem value="department3">Category 3</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}
        {step === 2 && (
  <div>
    <Typography variant="h6"> Brief Description </Typography>
    <TextField
      fullWidth
      variant="outlined"
      label="Brief Description"
      name="englishDesc"
      multiline
      rows={4}
      value={formData.englishDesc}
      onChange={handleChange}
      required
    />
    <Typography variant="h6"> संक्षिप्त विवरण </Typography>
    <TextField
      fullWidth
      variant="outlined"
      label="संक्षिप्त विवरण"
      name="hindiDesc"
      multiline
      rows={4}
      value={formData.hindiDesc}
      onChange={handleChange}
      required
    />
  </div>)
        }
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
            <Typography variant="h6">Indenter's Email</Typography>
             <TextField
              fullWidth
              variant="outlined"
              label="Indenter's Email"
              name="indenterMail"
              value={formData.indenterMail}
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
              Tender Submitted Successfully
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

export default TendersMain;
