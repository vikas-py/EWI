const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to serve static files
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/html', express.static(path.join(__dirname, 'public/html')));
app.use(bodyParser.text({ type: 'application/xml' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.get('/executed.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/executed.html'));
});

app.post('/saveWorkOrder', (req, res) => {
    const workOrderNumber = req.query.workOrderNumber;
    const filePath = path.join(__dirname, 'executed', `WorkOrder_${workOrderNumber}_instructions_set.xml`);

    fs.writeFile(filePath, req.body, (err) => {
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
            res.json(files.filter(file => file.endsWith('.xml')));
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
