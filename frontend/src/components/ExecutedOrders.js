import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ExecutedOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/executedOrders')
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error('Error fetching executed orders:', error));
  }, []);

  return (
    <div>
      <h2>Executed Work Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Work Order</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order}>
              <td>
                <Link to={`/order-details/${order}`}>{order}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExecutedOrders;
