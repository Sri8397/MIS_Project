import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import UploadArea from '../components/uploadArea';
import axios from 'axios';



const TendersMain = () => {
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
  const [dialogBoxData, setDialogBoxData] = useState('') 
  
  useEffect(() => {
      const fetchAvailableCategories = async () => {
        try{
          const categories = await axios.get('http://localhost:8000/api/categories');
          setAvailableCategories(categories.data.data);
          console.log(availableCategories);
        }catch(e){
          console.log(e);
        }
      }
      fetchAvailableCategories()
  }, [])

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
    ;
    requestBody.append('tender_number', formData.tenderNumber);
    requestBody.append('category_id', formData.category);
    requestBody.append('brief_description_en', formData.englishDesc);
    requestBody.append('brief_description_hi', formData.hindiDesc);
    requestBody.append('last_date_time', formData.lastDate);
    requestBody.append('intender_email', formData.indenterMail);
    requestBody.append('remarks', formData.remarks);
    

    try{
      const res = await axios.post('http://localhost:8000/api/tenders', requestBody, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        });
      setDialogBoxData("Tender Submitted Successfully");
      setOpenModal(true);
    }catch(e){
      const err = e.response.data.errors;
      // Check if the error object exists
      if (err) {
        // Loop through each key in the error object
        Object.keys(err).forEach(key => {
          // Check if the value corresponding to the key is an array
          if (Array.isArray(err[key])) {
            // Loop through each error message in the array
            err[key].forEach(errorMessage => {
              setDialogBoxData(errorMessage);
            });
          } else {
            // If the value is not an array, log it directly
            setDialogBoxData(err[key]);
          }
        });
      }
      setOpenModal(true);
    }
    // Implement form submission logic here
    setErrorMessage(''); // Clear error message
};

const closeModal = () => {
  setOpenModal(false); // Close modal
};
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom style={{textAlign :'center', marginBottom: '50px'}}>
        Tenders Page
      </Typography>
      <form >
      {errorMessage && (
        <Typography style={{color: 'red'}}>{errorMessage}</Typography>
      )}
        
        {step === 1 && (
          <div>
            <Typography variant="h6" style={{marginBottom: '20px'}}>Section/Department</Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Tender Number"
              name="tenderNumber"
              value={formData.tenderNumber}
              onChange={handleChange}
              required
              style={{marginBottom: '50px'}}
              />
            <Typography variant="h6" style={{marginBottom: '20px'}}>Select Category</Typography>
            <FormControl fullWidth variant="outlined" >
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
               {Array.isArray(availableCategories) && availableCategories.map((category) => (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    ))}
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
      style={{marginBottom: '16px'}}
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
            <Typography variant="h6" style={{marginBottom:'20px'}}>Last Date/Time</Typography>
            <TextField
              fullWidth
              type="datetime-local"
              variant="outlined"
              name="lastDate"
              value={formData.lastDate}
              onChange={handleChange}
              required
              style={{marginBottom: '50px'}}
            />
            <Typography variant="h6" style={{marginBottom:'20px'}}>Indenter's Email</Typography>
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
            style={{ marginBottom: '16px' }} 
          />
          {formData.attachmentRequired && (
            <>
              <FormControl fullWidth style={{ marginBottom: '16px' }}> 
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
                <UploadArea files={files} setFiles={setFiles} setErrorMessage={setErrorMessage} />
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
                  style={{ marginBottom: '16px' }}
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
            style={{ marginTop: '16px', marginBottom: '16px' }}
          />
        </div>
      )}
  <Modal
  open={openModal}
  onClose={closeModal}
  aria-labelledby="simple-modal-title"
  aria-describedby="simple-modal-description"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }}>
   <Typography variant="h6" id="modal-title" style={{ marginBottom: '16px', color:'black' }}>
      {dialogBoxData}
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={closeModal}
      style={{ alignSelf: 'flex-end' }}
    >
      Close
    </Button>
  </div>
</Modal>

        {/* Buttons */}
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          {step > 1 && (
            <Button variant="contained" color="primary" onClick={prevStep}style = {{marginTop: '20px', marginRight:'8px'}}>
              Previous
            </Button>
          )}
          {step < 4 && (
            <Button variant="contained" color="primary" onClick={nextStep} style = {{marginTop: '20px'}}>
              Next
            </Button>
          )}
          {step === 4 && (
            <Button variant="contained" color="primary" onClick={submitForm}style = {{marginTop: '20px'}}>
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TendersMain;
