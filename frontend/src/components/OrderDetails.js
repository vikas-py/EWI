import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetch(`/executedOrder?fileName=${id}`)
      .then(response => response.json())
      .then(data => setOrderDetails(data))
      .catch(error => console.error('Error fetching order details:', error));
  }, [id]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Step Number</th>
            <th>Step</th>
            <th>Input</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.workOrder.steps.map((step, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{step.text}</td>
              <td>{step.input || ''}</td>
              <td>{step.actions.start || ''}</td>
              <td>{step.actions.end || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;
