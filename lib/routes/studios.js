const router = require('express').Router();
const Studio = require('../model/studio');
const { HttpError } = require('../util/errors');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No pirate with id ${id}`
});

module.exports = router
    .get('/', (reg, res, net) => {
        Studio.find()
            .lean()
            .select('name')
            .populate({
                path: 
            })
    })
