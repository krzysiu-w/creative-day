'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const fs = require('fs');

router.get('/testAPI', (req, res) => {
    res.json(data);
});

router.use('/data', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});

router.use('/tasks', require('./tasks'));

module.exports = router;