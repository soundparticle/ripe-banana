const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const { HttpError } = require('../util/errors');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});

module.exports = router

    .post('/', (req, res, next) => {
        // console.log('*** req ***', req.body);
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id)
                .lean()
                .select('-__v'),
            Review
                .find({ 'reviewer': req.params.id })
                .select('rating film review')
                .populate('film', 'title')
        ])
            .then(([reviewer, reviews]) => {
                if(!reviewer) next(make404(req.params.id));
                else {
                    reviewer.reviews = reviews;
                    res.json(reviewer);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find(req.query)
            .lean()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });