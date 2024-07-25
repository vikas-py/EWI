let currentStepIndex = 0;
let steps;
let outputJSON = { workOrder: { steps: [] } };

document.getElementById('workOrderForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const workOrderNumber = document.getElementById('workOrderNumber').value;
    const fileInput = document.getElementById('fileInput').files[0];

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const jsonData = JSON.parse(e.target.result);
            loadInstructions(jsonData, workOrderNumber);
        };
        reader.readAsText(fileInput);
    }
});

function loadInstructions(jsonData, workOrderNumber) {
    document.getElementById('instructions').style.display = 'block';
    steps = jsonData.instructions;
    currentStepIndex = 0;
    displayStep();

    outputJSON.workOrder.number = workOrderNumber;
}

function displayStep() {
    const instructionStep = document.getElementById('instructionStep');
    instructionStep.innerHTML = '';

    if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        const stepText = step.text;
        const stepType = step.type || 'info'; // default to 'info' if no type specified

        const stepElement = document.createElement('div');
        stepElement.innerHTML = `<p>Step ${currentStepIndex + 1}: ${stepText}</p>`;

        if (stepType === 'dropdown') {
            const options = step.options;
            let selectHTML = '<select id="stepInput">';
            options.forEach(option => {
                selectHTML += `<option value="${option}">${option}</option>`;
            });
            selectHTML += '</select>';
            stepElement.innerHTML += selectHTML;
        } else if (stepType === 'userEntry') {
            stepElement.innerHTML += `<input type="text" id="stepInput" placeholder="Enter value">`;
        } else if (stepType === 'confirmation') {
            stepElement.innerHTML += `<button onclick="confirmStep()">Confirm</button>`;
        }

        instructionStep.appendChild(stepElement);
        document.getElementById('prevStep').style.display = currentStepIndex > 0 ? 'inline' : 'none';
        document.getElementById('nextStep').style.display = stepType !== 'confirmation' ? 'inline' : 'none';
        document.getElementById('completeOrder').style.display = 'none';
    } else {
        document.getElementById('nextStep').style.display = 'none';
        document.getElementById('completeOrder').style.display = 'inline';
    }
}

function confirmStep() {
    recordAction('start', currentStepIndex);
    recordAction('end', currentStepIndex);
    currentStepIndex++;
    displayStep();
}

document.getElementById('prevStep').addEventListener('click', function () {
    currentStepIndex--;
    displayStep();
});

document.getElementById('nextStep').addEventListener('click', function () {
    const input = document.getElementById('stepInput');
    if (input) {
        const value = input.value;
        recordAction('input', currentStepIndex, value);
    }
    recordAction('start', currentStepIndex);
    recordAction('end', currentStepIndex);
    currentStepIndex++;
    displayStep();
});

function recordAction(action, stepIndex, value = '') {
    const date = new Date();
    const timestamp = date.toISOString();
    const step = steps[stepIndex];

    if (!outputJSON.workOrder.steps[stepIndex]) {
        outputJSON.workOrder.steps[stepIndex] = { text: step.text, actions: {} };
    }

    if (action === 'input') {
        outputJSON.workOrder.steps[stepIndex].input = value;
    }

    outputJSON.workOrder.steps[stepIndex].actions[action] = timestamp;
}

document.getElementById('completeOrder').addEventListener('click', function () {
    saveWorkOrder(outputJSON);
});

function saveWorkOrder(jsonData) {
    const workOrderNumber = document.getElementById('workOrderNumber').value;

    fetch(`/saveWorkOrder?workOrderNumber=${workOrderNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        if (document.getElementById('executedOrdersList')) {
            addExecutedOrderLink(workOrderNumber);
        }
    })
    .catch(error => {
        alert('Error saving work order: ' + error);
    });
}

function addExecutedOrderLink(workOrderNumber) {
    const executedOrdersList = document.getElementById('executedOrdersList');
    const row = executedOrdersList.insertRow();
    const cell = row.insertCell(0);
    const linkElement = document.createElement('a');
    linkElement.href = `executed.html?file=WorkOrder_${workOrderNumber}_instructions_set.json`;
    linkElement.textContent = `Work Order ${workOrderNumber}`;
    cell.appendChild(linkElement);
}
