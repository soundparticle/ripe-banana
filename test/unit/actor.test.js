const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Actor = require('../../lib/models/actor');

describe('Actor model', () => {

    it('validates a good model', () => {
        const data = {
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        };

        const actor = new Actor(data);
        const json = actor.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(actor.validateSync());
    });
    
});