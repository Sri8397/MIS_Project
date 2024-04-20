import React, { useState, useEffect} from 'react';
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


const OfficeOrders = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState([]);
  const [elements, setElements] = useState([]); // State for options based on category
  const [selectedOption, setSelectedOption] = useState('');

  // State for selected option ID
  const [files, setFiles] = useState([]);
  const [dialogBoxData, setDialogBoxData] = useState(''); // State for dialog box data
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
      setDialogBoxData("Order Submitted Successfully");
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
    setErrorMessage(''); 
};
const closeModal = () => {
  setOpenModal(false); // Close modal
};

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}> {/* Set max-width and center align */}
    <Typography variant="h4" gutterBottom style={{textAlign :'center', marginBottom: '50px', marginTop: '20px'}}>
      Office Orders Form
    </Typography>
    <form>
      {errorMessage && (
        <Typography style={{color: 'red'}}>{errorMessage}</Typography>
      )}
  
      {step === 1 && (
        <div>
          <Typography variant="h6" style={{marginBottom: '20px'}}>Section/Department</Typography>
          <FormControl fullWidth style={{ marginBottom: '50px' }}> {/* Add marginBottom */}
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
          <Typography variant="h6" style={{marginBottom: '20px'}}>Give a suitable Title</Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="English Title"
            name="englishTitle"
            value={formData.englishTitle}
            onChange={handleChange}
            required
            style={{ marginBottom: '50px' }} 
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Hindi Title"
            name="hindiTitle"
            value={formData.hindiTitle}
            onChange={handleChange}
            required
            style={{ marginBottom: '16px' }} 
          />
        </div>
      )}
      {step === 3 && (
        <div>
          <Typography variant="h6" style={{marginBottom: '20px'}}>Last Date/Time</Typography>
          <TextField
            fullWidth
            type="datetime-local"
            variant="outlined"
            name="lastDate"
            value={formData.lastDate}
            onChange={handleChange}
            required
            style={{ marginBottom: '16px' }}
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
      <div style={{ marginTop: '16px', textAlign: 'right' }}> {/* Add marginTop and textAlign */}
        {step > 1 && (
          <Button variant="contained" color="primary" onClick={prevStep} style={{marginTop: '20px', marginRight:'8px'}}> {/* Add marginRight */}
            Previous
          </Button>
        )}
        {step < 4 && (
          <Button variant="contained" color="primary" onClick={nextStep} style={{marginTop: '20px'}}> {/* Add marginRight */}
            Next
          </Button>
        )}
        {step === 4 && (
          <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: '20px'}}>
            Submit
          </Button>
        )}
      </div>
    </form>
  </div>
  
  );
};

export default OfficeOrders;


