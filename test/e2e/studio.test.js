const { assert } = require('chai');
const request = require('./request');
const { dropCollection  } = require('./db');

const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));

    function save(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let universal;
    let paramount;

    beforeEach(() => {
        return save({
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => {
                universal = data;
            });
    });

    it('saves a studio', () => {
        assert.isOk(universal._id);
    });

    it('gets a studio by id', () => {
        return request
            .get(`/api/studios/${universal._id}`)
            .then(checkOk);
    });


});