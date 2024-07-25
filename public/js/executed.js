document.addEventListener('DOMContentLoaded', function () {
    fetch('/executedOrders')
        .then(response => response.json())
        .then(files => {
            const executedOrdersList = document.getElementById('executedOrdersList');
            files.forEach(file => {
                const row = executedOrdersList.insertRow();
                const cell = row.insertCell(0);
                const linkElement = document.createElement('a');
                linkElement.href = `#`;
                linkElement.textContent = file;
                linkElement.addEventListener('click', function () {
                    fetchOrderDetails(file);
                });
                cell.appendChild(linkElement);
            });
        })
        .catch(error => {
            console.error('Error fetching executed orders:', error);
        });
});

function fetchOrderDetails(fileName) {
    fetch(`/executedOrder?fileName=${fileName}`)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const steps = xmlDoc.getElementsByTagName('step');
            const orderDetailsContent = document.getElementById('orderDetailsContent');
            orderDetailsContent.innerHTML = '';

            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${step.textContent}</td>
                    <td>${step.getAttribute('input') || ''}</td>
                    <td>${step.getAttribute('startTime') || ''}</td>
                    <td>${step.getAttribute('endTime') || ''}</td>
                `;
                orderDetailsContent.appendChild(row);
            }

            document.getElementById('orderDetails').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
        });
}
