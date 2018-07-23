const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Films API', () => {
    
    beforeEach(() => dropCollection('films'));

    function save(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let dracula;
    let machete;

    beforeEach(() => {
        return request
            .post('/api/films')
            .send({ })
    })

});