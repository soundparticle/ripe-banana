const router = require('express').Router();
const Film = require('../models/film');
const { HttpError } = require('../util/errors');

const unpdateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No film with id ${id}`
});

module.exports = router
    .post('/', (req, res, next) => {
        console.log('** req **', req);
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });