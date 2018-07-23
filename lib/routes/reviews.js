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
    })

    .get('/', (req, res, next) => {
        Review.find(req.query)
            .populate('reviewer', 'name')
            .populate('film', 'title')
            .sort({ 'date': -1 })
            .limit(100)
            .lean()
            .then(reviews => res.json(reviews))
            .catch(next);
    });