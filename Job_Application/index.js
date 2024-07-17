const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let jobs = [];
let nextId = 1;

// Create a Job
app.post('/jobs', (req, res) => {
    const job = {
        id: nextId++,
        title: req.body.title,
        company: req.body.company,
        description: req.body.description
    };
    jobs.push(job);
    res.status(201).json(job);
});

// Update a Job
app.put('/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex > -1) {
        const updatedJob = {
            id: id,
            title: req.body.title,
            company: req.body.company,
            description: req.body.description
        };
        jobs[jobIndex] = updatedJob;
        res.json(updatedJob);
    } else {
        res.status(404).json({ message: "Job not found" });
    }
});

// Delete a Job
app.delete('/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex > -1) {
        jobs.splice(jobIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Job not found" });
    }
});

// Get all Jobs
app.get('/jobs', (req, res) => {
    res.json(jobs);
});

app.listen(port, () => {
    console.log(`Job API listening at http://localhost:${port}`);
});