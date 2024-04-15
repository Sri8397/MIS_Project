// pages/index.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import TypeOfForm from './components/typeOfForm'

function FormPage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    router.push(`/form/${option}`);
  };


  return (
    <div>
      <TypeOfForm handleOptionSelect={handleOptionSelect} />
    </div>
  );
}

export default FormPage;
