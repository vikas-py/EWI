import React, { useState } from 'react';

const WorkOrderForm = ({ onLoadInstructions }) => {
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = () => {
      const jsonData = JSON.parse(reader.result);
      onLoadInstructions(jsonData, workOrderNumber);
    };
    if (file) reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="workOrderNumber">Work Order Number:</label>
      <input type="text" id="workOrderNumber" value={workOrderNumber} onChange={e => setWorkOrderNumber(e.target.value)} required />
      <label htmlFor="fileInput">Select Instructions JSON File:</label>
      <input type="file" id="fileInput" accept=".json" onChange={e => setFile(e.target.files[0])} required />
      <button type="submit">Load Instructions</button>
    </form>
  );
};

export default WorkOrderForm;
