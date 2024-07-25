const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.get('/html/executed.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/executed.html'));
});

app.post('/saveWorkOrder', (req, res) => {
    const workOrderNumber = req.query.workOrderNumber;
    const filePath = path.join(__dirname, 'executed', `WorkOrder_${workOrderNumber}_instructions_set.json`);

    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            res.status(500).send('Error saving file');
        } else {
            res.status(200).send('File saved successfully');
        }
    });
});

app.get('/executedOrders', (req, res) => {
    fs.readdir(path.join(__dirname, 'executed'), (err, files) => {
        if (err) {
            res.status(500).send('Error reading executed orders directory');
        } else {
            res.json(files.filter(file => file.endsWith('.json')));
        }
    });
});

app.get('/executedOrder', (req, res) => {
    const fileName = req.query.fileName;
    const filePath = path.join(__dirname, 'executed', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading executed order file');
        } else {
            res.send(data);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
