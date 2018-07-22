const router = require('express').Router();
const Reviewer = require('../models/reviewer');
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
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Reviewer.findById(req.params.id)
            .lean()
            .then(reviewer => {
                if(!reviewer) next(make404(req.params.id));
                else {
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