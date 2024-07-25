import React from 'react';

const InstructionStep = ({ step, stepIndex, onNext, onPrev, onComplete, showPrev, showNext, showComplete }) => (
  <div className="card">
    <p>Step {stepIndex + 1}: {step.text}</p>
    {step.type === 'dropdown' && (
      <select id="stepInput">
        {step.options.map((option, index) => <option key={index} value={option}>{option}</option>)}
      </select>
    )}
    {step.type === 'userEntry' && (
      <input type="text" id="stepInput" placeholder="Enter value" />
    )}
    {step.type === 'confirmation' && (
      <button onClick={onNext}>Confirm</button>
    )}
    <div>
      {showPrev && <button onClick={onPrev}>Previous Step</button>}
      {showNext && <button onClick={onNext}>Next Step</button>}
      {showComplete && <button onClick={onComplete}>Complete Work Order</button>}
    </div>
  </div>
);

export default InstructionStep;
