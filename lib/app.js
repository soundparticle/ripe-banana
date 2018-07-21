const express = require('express');
const app = express();
// const morgan = require('morgan');

// app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

// routes
const  studios = require('./routes/studios');
// const  actors = require('./routes/actors');
const  reviewers = require('./routes/reviewers');

app.use('/api/studios', studios);
// app.use('/api/actors', actors);
app.use('/api/reviewers', reviewers);

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
// general 404
app.use((req, res) => {
    res.sendStatus(404);
});

//eslint=disable-next-line
app.use(handler);

module.exports = app;
