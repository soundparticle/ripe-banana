const router = require('express').Router();
const Review = require('../models/review');
const { HttpError } = require('../util/errors');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No review with id ${id}`
});

module.exports = router

    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });