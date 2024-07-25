import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import WorkOrderForm from './components/WorkOrderForm';
import InstructionStep from './components/InstructionStep';
import ExecutedOrders from './components/ExecutedOrders';
import OrderDetails from './components/OrderDetails';
import './App.css';  // Import the CSS file here

const App = () => {
  const [instructions, setInstructions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const loadInstructions = (jsonData, workOrderNumber) => {
    setInstructions(jsonData.instructions);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const completeOrder = () => {
    alert('Work Order Completed');
  };

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <WorkOrderForm onLoadInstructions={loadInstructions} />
                {instructions.length > 0 && (
                  <InstructionStep
                    step={instructions[currentStep]}
                    stepIndex={currentStep}
                    onNext={nextStep}
                    onPrev={prevStep}
                    onComplete={completeOrder}
                    showPrev={currentStep > 0}
                    showNext={currentStep < instructions.length - 1 && instructions[currentStep].type !== 'confirmation'}
                    showComplete={currentStep === instructions.length - 1}
                  />
                )}
              </>
            }
          />
          <Route path="/executed-orders" element={<ExecutedOrders />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
