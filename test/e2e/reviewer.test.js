const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => dropCollection('reviewers'));

    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let tyrone;
    let chip;

    beforeEach(() => {
        return save({
            name: 'Tyrone Payton',
            company: 'Fermented Banana'
        })
            .then(data => tyrone = data);
    });

    beforeEach(() => {
        return save({
            name: 'Chip Ellsworth III',
            company: 'Fermented Banana'
        })
            .then(data => chip = data);
    });

    it('saves a reviewer', () => {
        assert.isOk(chip._id);
        assert.isOk(tyrone._id);
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${chip._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, chip);
            });
    });

    it('gets all reviewers', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [tyrone, chip]);
            });
    });


});