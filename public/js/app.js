let currentStepIndex = 0;
let steps;
let outputXML;

document.getElementById('workOrderForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const workOrderNumber = document.getElementById('workOrderNumber').value;
    const fileInput = document.getElementById('fileInput').files[0];

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            loadInstructions(xmlDoc, workOrderNumber);
        };
        reader.readAsText(fileInput);
    }
});

function loadInstructions(xmlDoc, workOrderNumber) {
    document.getElementById('instructions').style.display = 'block';
    steps = xmlDoc.getElementsByTagName('step');
    currentStepIndex = 0;
    displayStep();

    createOutputXML(xmlDoc, workOrderNumber);
}

function displayStep() {
    const instructionStep = document.getElementById('instructionStep');
    instructionStep.innerHTML = '';

    if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        const stepText = step.textContent;
        const stepType = step.getAttribute('type') || 'text'; // default to 'text' if no type specified

        const stepElement = document.createElement('div');
        stepElement.innerHTML = `<p>Step ${currentStepIndex + 1}: ${stepText}</p>`;

        if (stepType === 'dropdown') {
            const options = step.getAttribute('options').split(',');
            let selectHTML = '<select id="stepInput">';
            options.forEach(option => {
                selectHTML += `<option value="${option}">${option}</option>`;
            });
            selectHTML += '</select>';
            stepElement.innerHTML += selectHTML;
        }

        instructionStep.appendChild(stepElement);
        document.getElementById('prevStep').style.display = currentStepIndex > 0 ? 'inline' : 'none';
        document.getElementById('nextStep').style.display = 'inline';
        document.getElementById('completeOrder').style.display = 'none';
    } else {
        document.getElementById('nextStep').style.display = 'none';
        document.getElementById('completeOrder').style.display = 'inline';
    }
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

function createOutputXML(xmlDoc, workOrderNumber) {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    outputXML = parser.parseFromString(xmlString, "text/xml");
    const workOrderElement = outputXML.createElement('workOrder');
    workOrderElement.setAttribute('number', workOrderNumber);
    outputXML.documentElement.appendChild(workOrderElement);
}

function recordAction(action, stepIndex, value = '') {
    const date = new Date();
    const timestamp = date.toISOString();
    const step = outputXML.getElementsByTagName('step')[stepIndex];
    step.setAttribute(action + 'Time', timestamp);
    if (action === 'input') {
        step.setAttribute('input', value);
    }
}

document.getElementById('completeOrder').addEventListener('click', function () {
    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(outputXML);
    saveWorkOrder(xmlStr);
});

function saveWorkOrder(xmlStr) {
    const workOrderNumber = document.getElementById('workOrderNumber').value;

    fetch(`/saveWorkOrder?workOrderNumber=${workOrderNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xmlStr,
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        // Only add link if we are on the executed orders page
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
    linkElement.href = `executed.html?file=WorkOrder_${workOrderNumber}_instructions_set.xml`;
    linkElement.textContent = `Work Order ${workOrderNumber}`;
    cell.appendChild(linkElement);
}
