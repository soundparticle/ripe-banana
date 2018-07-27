const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureAdmin = require('../util/ensure-role')('admin');


const make404 = id => new HttpError({
    code: 404,
    message: `No studio with id ${id}`
});

module.exports = router

    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Studio.findById(req.params.id)
                .lean()
                .select('name address'),
            Film
                .find({ 'studio': req.params.id })
                .lean()
                .select('title')
        ])
            .then(([studio, films]) => {
                if(!studio) {
                    next(make404(req.params.id));
                } else {
                    studio.films = films;
                    res.json(studio);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find(req.query) 
            .lean()
            .select('name')
            .then(studios => res.json(studios))
            .catch(next); 
    })

    .delete('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Film.find({ 'studio': req.params.id })
            .then(films => {
                if(films.length > 0) {
                    res.json({ removed: false });
                } else {
                    Studio.findByIdAndRemove(req.params.id)
                        .then(studio => res.json({ removed: !!studio }));
                }
            })
            .catch(next);
    });