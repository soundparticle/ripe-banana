const chai = require('chai');
const { assert } = chai;
const { getErrors } = require('./helpers');
const { Types } = require('mongoose');
const Film = require('../../lib/models/film');

describe('Film model', () => {

    it('validates good model', () => {
        const data = {
            title: 'Dracula',
            studio: Types.ObjectId(),
            released: 1992,
            cast: [{
                role: 'Mina Harker',
                actor: Types.ObjectId()
            }]
        };

        const film = new Film(data);

        const json = film.toJSON();
        delete json._id;
        json.cast.forEach(a => delete a._id);
        console.log('***json***', json);
        assert.isUndefined(film.validateSync());
        assert.deepEqual(json, data);
    });
});