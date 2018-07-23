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
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .populate('studio', 'name')
            .populate('cast.actor', 'name')
            .lean()
            .then(film => {
                if(!film) next(make404(req.params.id));
                else {
                    res.json(film);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film.find(req.query)
            .populate('studio', 'name')
            .populate('cast.actor', 'name')
            .lean()
            .then(films => res.json(films))
            .catch(next);   
    });