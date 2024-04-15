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
import { set } from 'nprogress';

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

const NoticesMain = () => {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    section: '',
    department: '',
    englishTitle: '',
    hindiTitle: '',
    lastDate: '',
    attachmentRequired: false,
    attachmentType: '',
    attachmentLink: '',
    attachmentFiles: [],
    remarks: '',

  });
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
    if (step === 1 && (!formData.section || !formData.department)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (step === 2 && (!formData.englishTitle || !formData.hindiTitle)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (step === 3 && !formData.lastDate) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    
    setErrorMessage(''); // Clear error message
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const submitForm = () => {
    if(step === 4 && formData.attachmentRequired && !formData.attachmentType){
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (step === 4 && formData.attachmentType === 'link' && !formData.attachmentLink || formData.attachmentType === 'upload' && formData.attachmentFiles.length === 0) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Implement form submission logic here
    console.log('Form submitted:', formData);
    setErrorMessage(''); // Clear error message
    setOpenModal(true); // Open modal after form submission
};

const closeModal = () => {
  setOpenModal(false); // Close modal
};
  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Notice Page
      </Typography>
      <form className={classes.form}>
        {errorMessage && (
          <Typography className={classes.errorText}>{errorMessage}</Typography>
        )}
        {/* Form steps */}
        {step === 1 && (
          <div>
            <Typography variant="h6">Section/Department</Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Section</InputLabel>
              <Select
                label="Section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >
                <MenuItem value="section1">Section 1</MenuItem>
                <MenuItem value="section2">Section 2</MenuItem>
                <MenuItem value="section3">Section 3</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <MenuItem value="department1">Department 1</MenuItem>
                <MenuItem value="department2">Department 2</MenuItem>
                <MenuItem value="department3">Department 3</MenuItem>
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
                  <UploadArea formData={formData} setFormData={setFormData} uploadedFiles={formData.attachmentFiles}/>
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
              Submitted Successfully
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

export default NoticesMain;
