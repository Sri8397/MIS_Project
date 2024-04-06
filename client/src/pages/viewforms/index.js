import React, { useState } from 'react';
import Component1 from './components/noticeTable';
import Component2 from './components/officeOrderTable';
import Component3 from './components/TenderTable';

const MyComponent = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case 'option1':
        return <Component1 />;
      case 'option2':
        return <Component2 />;
      case 'option3':
        return <Component3 />;
      default:
        return null;
    }
  };

  return (
    <div>
      <label htmlFor="dropdown">Select an option:</label>
      <select id="dropdown" value={selectedOption} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      {renderComponent()}
    </div>
  );
};

export default MyComponent;
